#!/usr/bin/env python3
"""Image weight pass for whitewill-landing.

Two different strategies because the two asset roots have different contracts:

  src/assets/projects/**  — reached ONLY through the import.meta.glob in
      src/projectGallery.js, which already matches {jpg,jpeg,png,webp} and has
      zero direct imports. Safe to CONVERT to .webp and drop the original.

  public/**               — referenced by literal path strings all over the app
      and in prerendered HTML. Filenames and extensions MUST NOT change, so
      these are recompressed in place.

Also caps any image at MAX_W px wide: the widest layout column is 1180 CSS px,
so 2000 px still covers retina.

DRY=1 to preview.
"""
import os, sys, glob
from PIL import Image

DRY = os.environ.get('DRY') == '1'
MAX_W = 2000
JPEG_Q = 82
WEBP_Q = 82

Image.MAX_IMAGE_PIXELS = None


def human(n):
    return f"{n/1048576:.1f} MB" if n >= 1048576 else f"{n/1024:.0f} KB"


def cap(im):
    if im.width > MAX_W:
        h = round(im.height * MAX_W / im.width)
        return im.resize((MAX_W, h), Image.LANCZOS), True
    return im, False


before = after = 0
converted = recompressed = skipped = 0
notes = []

# ── 1. project galleries → webp ────────────────────────────────────────────
for f in sorted(glob.glob('src/assets/projects/*/*.*')):
    if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    b = os.path.getsize(f)
    before += b
    out = os.path.splitext(f)[0] + '.webp'
    try:
        im = Image.open(f)
        im, resized = cap(im)
        if im.mode not in ('RGB', 'RGBA'):
            im = im.convert('RGBA' if 'A' in im.mode else 'RGB')
        if DRY:
            import io
            buf = io.BytesIO(); im.save(buf, 'WEBP', quality=WEBP_Q, method=6)
            a = buf.tell()
        else:
            im.save(out, 'WEBP', quality=WEBP_Q, method=6)
            a = os.path.getsize(out)
            os.remove(f)
        after += a
        converted += 1
        if b - a > 300_000:
            notes.append(f"    {f} {human(b)} -> {human(a)}{' (resized)' if resized else ''}")
    except Exception as e:
        after += b; skipped += 1
        notes.append(f"    SKIP {f}: {e}")

# ── 2. public/** recompressed in place ─────────────────────────────────────
for f in sorted(glob.glob('public/**/*.*', recursive=True)):
    ext = os.path.splitext(f)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png'):
        continue
    b = os.path.getsize(f)
    before += b
    try:
        im = Image.open(f)
        im, resized = cap(im)
        import io
        buf = io.BytesIO()
        if ext == '.png':
            has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
            if has_alpha:
                im2 = im.convert('RGBA')
                # palette-quantize keeps alpha and cuts flat UI art dramatically
                im2 = im2.quantize(colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG) if b > 60_000 else im2
                im2.save(buf, 'PNG', optimize=True)
            else:
                im2 = im.convert('RGB')
                if b > 200_000:
                    im2 = im2.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
                im2.save(buf, 'PNG', optimize=True)
        else:
            im.convert('RGB').save(buf, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
        a = buf.tell()
        # Only rewrite when the saving is real. These JPEGs are already
        # well compressed; a 5% gain is not worth the generation loss.
        if a < b * 0.80:
            if not DRY:
                with open(f, 'wb') as fh:
                    fh.write(buf.getvalue())
            after += a
            recompressed += 1
            if b - a > 200_000:
                notes.append(f"    {f} {human(b)} -> {human(a)}{' (resized)' if resized else ''}")
        else:
            after += b
            skipped += 1
    except Exception as e:
        after += b; skipped += 1
        notes.append(f"    SKIP {f}: {e}")

print(f"{'[DRY RUN] ' if DRY else ''}images: {converted} converted to webp, {recompressed} recompressed, {skipped} left alone")
print(f"  {human(before)}  ->  {human(after)}   ({(1-after/before)*100:.0f}% smaller)")
if notes:
    print("\n  biggest wins / problems:")
    for n in notes[:16]:
        print(n)

"""Generate 640px-wide WebP thumbnails of each project's COVER image.

WHY: the community tiles on /property-prices-in-oman and the three city
landings render at ~310 CSS px but download the full 1600px cover, which is
~770 KB of images on a single page load. A 640w variant in a srcset lets the
browser pick sensibly. Kept in a SEPARATE directory because projectGallery.js
globs src/assets/projects/*/* and would otherwise treat a thumb as a gallery
image (and the cover is "first file", so it would also shuffle covers).

Re-runnable and idempotent. DRY=1 to preview.
"""
import os, sys
from PIL import Image

SRC = 'src/assets/projects'
DST = 'src/assets/thumbs'
WIDTH = 640
DRY = os.environ.get('DRY') == '1'

def natural(n):
    base = os.path.splitext(n)[0]
    return (0, int(base)) if base.isdigit() else (1, 0, base)

total_in = total_out = 0
for slug in sorted(os.listdir(SRC)):
    d = os.path.join(SRC, slug)
    if not os.path.isdir(d):
        continue
    files = [f for f in os.listdir(d) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    if not files:
        continue
    cover = sorted(files, key=natural)[0]
    src = os.path.join(d, cover)
    out_dir = os.path.join(DST, slug)
    out = os.path.join(out_dir, '1.webp')
    im = Image.open(src)
    if im.width <= WIDTH:
        print(f'skip {slug}: source already {im.width}px')
        continue
    h = round(im.height * WIDTH / im.width)
    im = im.convert('RGB').resize((WIDTH, h), Image.LANCZOS)
    size_in = os.path.getsize(src)
    total_in += size_in
    if not DRY:
        os.makedirs(out_dir, exist_ok=True)
        im.save(out, 'WEBP', quality=80, method=6)
        size_out = os.path.getsize(out)
    else:
        size_out = 0
    total_out += size_out
    print(f'{slug:<22} {cover:<9} {size_in//1024:>4} KB -> {size_out//1024:>3} KB  ({WIDTH}x{h})')

print(f'\nTOTAL {total_in//1024} KB -> {total_out//1024} KB')

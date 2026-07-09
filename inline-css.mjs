// Inlines the built main stylesheet into dist/index.html.
// Removes the render-blocking CSS round trip: on simulated slow-4G that
// request alone pushed FCP past 3s. The 42 KB sheet gzips to ~8 KB inside
// the HTML document, which is already the first response.
import { readFileSync, writeFileSync } from 'fs'

const htmlPath = 'dist/index.html'
let html = readFileSync(htmlPath, 'utf8')

html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]+href="\/(assets\/index-[^"]+\.css)"[^>]*>/,
  (match, file) => `<style>${readFileSync(`dist/${file}`, 'utf8')}</style>`,
)

if (html.includes('assets/index-') && /<link[^>]+\.css/.test(html)) {
  console.warn('inline-css: a css link may remain — check dist/index.html')
}
writeFileSync(htmlPath, html)
console.log('inline-css: main stylesheet inlined into index.html')

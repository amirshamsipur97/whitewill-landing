// Writes dist/version.json with the entry bundle's hashed filename, so a
// long-lived tab can tell it is running an older build. See
// src/lib/buildVersion.js for why. Runs last in the build chain.
import { readFileSync, writeFileSync, readdirSync } from 'fs'

const html = readFileSync('dist/index.html', 'utf8')
const m = html.match(/src="\/assets\/(index-[A-Za-z0-9_-]+\.js)"/)
const entry = m ? m[1] : readdirSync('dist/assets').find((f) => /^index-.*\.js$/.test(f))
if (!entry) throw new Error('write-version: could not find the entry bundle')
writeFileSync('dist/version.json', JSON.stringify({ entry }) + '\n')
console.log(`write-version: ${entry}`)

const fs = require('fs')
const src = fs.readFileSync('backend/prisma/seed.ts', 'utf8')
const start = src.indexOf('const challenges = [')
const open = src.indexOf('[', start)
// find matching close bracket
let depth = 0, end = -1
for (let i = open; i < src.length; i++) {
  if (src[i] === '[') depth++
  else if (src[i] === ']') { depth--; if (depth === 0) { end = i; break } }
}
const arrLiteral = src.slice(open, end + 1)
const challenges = eval(arrLiteral)
fs.writeFileSync('challenges.json', JSON.stringify(challenges, null, 2))
console.log('extracted', challenges.length, 'challenges -> challenges.json')

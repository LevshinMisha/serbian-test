import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'public', 'data')
const CHUNK = 1000

const candidates = [
  path.join(root, 'a1.json'),
  path.join(outDir, 'a1.json'),
]

const src = candidates.find((p) => fs.existsSync(p))
if (!src) {
  console.error('Нет файла a1.json в корне проекта или public/data/')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(src, 'utf8'))
const fileCount = Math.ceil(data.length / CHUNK)

fs.mkdirSync(outDir, { recursive: true })

for (const file of fs.readdirSync(outDir)) {
  if (/^a1_\d+\.json$/.test(file)) {
    fs.unlinkSync(path.join(outDir, file))
  }
}

for (let i = 0; i < fileCount; i++) {
  const chunk = data.slice(i * CHUNK, (i + 1) * CHUNK)
  fs.writeFileSync(path.join(outDir, `a1_${i + 1}.json`), JSON.stringify(chunk))
}

if (src !== path.join(outDir, 'a1.json')) {
  fs.unlinkSync(src)
} else {
  fs.unlinkSync(path.join(outDir, 'a1.json'))
}

console.log(`Готово: ${data.length} заданий → ${fileCount} файлов по ${CHUNK} в public/data/`)

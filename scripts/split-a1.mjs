import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, '..', 'public', 'data')
const src = path.join(dir, 'a1.json')
const CHUNK = 1000

if (!fs.existsSync(src)) {
  console.error('Нет файла public/data/a1.json')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(src, 'utf8'))
const fileCount = Math.ceil(data.length / CHUNK)

for (let i = 0; i < fileCount; i++) {
  const chunk = data.slice(i * CHUNK, (i + 1) * CHUNK)
  fs.writeFileSync(path.join(dir, `a1_${i + 1}.json`), JSON.stringify(chunk))
}

fs.unlinkSync(src)
console.log(`Готово: ${data.length} заданий → ${fileCount} файлов по ${CHUNK}`)

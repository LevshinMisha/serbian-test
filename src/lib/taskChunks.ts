import type { Task } from '../types/task'

export const CHUNK_SIZE = 1000
export const TEST_QUESTION_COUNT = 30

export function chunkUrl(index: number): string {
  const base = import.meta.env.BASE_URL
  return `${base}data/a1_${index}.json`
}

const cache = new Map<number, Task[]>()
const inflight = new Map<number, Promise<Task[]>>()

export async function fetchChunk(index: number): Promise<Task[]> {
  if (index < 1 || index > TEST_QUESTION_COUNT) {
    throw new Error(`Недопустимый индекс файла: ${index}`)
  }

  const cached = cache.get(index)
  if (cached) return cached

  const pending = inflight.get(index)
  if (pending) return pending

  const promise = (async () => {
    const response = await fetch(chunkUrl(index))
    if (!response.ok) {
      throw new Error(`Не удалось загрузить a1_${index}.json (${response.status})`)
    }
    const tasks = (await response.json()) as Task[]
    cache.set(index, tasks)
    inflight.delete(index)
    return tasks
  })()

  inflight.set(index, promise)
  try {
    return await promise
  } catch (err) {
    inflight.delete(index)
    throw err
  }
}

/** Загружает чанк в фоне, без ожидания результата. */
export function prefetchChunk(index: number): void {
  if (index < 1 || index > TEST_QUESTION_COUNT) return
  if (cache.has(index) || inflight.has(index)) return
  void fetchChunk(index).catch(() => {
    /* ошибка будет обработана при явной загрузке */
  })
}

export function pickRandomTask(tasks: Task[]): Task {
  const index = Math.floor(Math.random() * tasks.length)
  return tasks[index]!
}

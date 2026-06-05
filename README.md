# Сербский язык — тест A1

Клиентское приложение для изучения сербского языка (уровень A1). Без бэкенда: задания загружаются частями из `public/data/a1_{1..30}.json` (по 1000 упражнений в файле).

## Стек

- Node.js + Vite
- React 19
- Zustand (сохранение прогресса в `localStorage`)

## Запуск

```bash
npm install
npm run dev
```

Сборка для статического хостинга:

```bash
npm run build
npm run preview
```

## Деплой на Vercel

1. Залейте репозиторий на GitHub/GitLab/Bitbucket (в репозитории должны быть **`public/data/*.json`** — без них тест не загрузит задания).
2. В [vercel.com](https://vercel.com) → **Add New Project** → импортируйте репозиторий.
3. Vercel подхватит настройки из `vercel.json`:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. После деплоя раздаётся статика из `dist` (HTML, JS/CSS в `assets/`, JSON в `data/`).

Локально проверить прод-сборку:

```bash
npm run build
npm run preview
```

Через CLI: `npx vercel` (preview) или `npx vercel --prod`.

## Данные

- `public/data/a1_{n}.json` — по 1000 заданий (всего 30 файлов, 30 000 упражнений).
- Тест: 30 вопросов; вопрос *n* берёт случайное задание из `a1_{n}.json`.
- Чанки подгружаются по требованию; следующие 1–2 файла предзагружаются заранее.

Пересобрать чанки из исходного `a1.json` (положите файл в корень проекта или в `public/data/`):

```bash
node scripts/split-a1.mjs
```

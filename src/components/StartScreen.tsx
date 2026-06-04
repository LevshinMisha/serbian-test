import { useQuizStore } from '../store/quizStore'
import { TEST_QUESTION_COUNT } from '../lib/taskChunks'

export function StartScreen() {
  const startTest = useQuizStore((s) => s.startTest)
  const loadError = useQuizStore((s) => s.loadError)
  const loadStatus = useQuizStore((s) => s.loadStatus)
  const starting = loadStatus === 'loading'

  return (
    <div className="screen screen--welcome">
      <div className="welcome">
        <span className="welcome__badge">A1</span>
        <h1 className="welcome__title">Тест по сербскому языку</h1>
        <p className="welcome__text">
          {TEST_QUESTION_COUNT} вопросов. В каждом — случайное задание из своего набора
          упражнений.
        </p>
        {loadError && <p className="welcome__error">{loadError}</p>}
        <button
          type="button"
          className="btn btn--primary btn--lg"
          disabled={starting}
          onClick={() => void startTest()}
        >
          {starting ? 'Подготовка…' : 'Начать тест'}
        </button>
      </div>
    </div>
  )
}

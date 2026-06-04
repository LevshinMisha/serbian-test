import { getResultMessage } from '../lib/resultMessages'
import { TEST_QUESTION_COUNT } from '../lib/taskChunks'
import { useQuizStore } from '../store/quizStore'

export function ResultsScreen() {
  const correctCount = useQuizStore((s) => s.correctCount)
  const answeredCount = useQuizStore((s) => s.answeredCount)
  const backToWelcome = useQuizStore((s) => s.backToWelcome)

  const pct = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0
  const verdict = getResultMessage(pct)

  return (
    <div className="screen screen--welcome">
      <div className="welcome">
        <h1 className="welcome__title">Тест завершён</h1>
        <p className="welcome__text">
          Верно: <strong>{correctCount}</strong> из {TEST_QUESTION_COUNT} ({pct}%)
        </p>
        <p className="welcome__verdict">{verdict}</p>
        <button type="button" className="btn btn--primary btn--lg" onClick={backToWelcome}>
          На главную
        </button>
      </div>
    </div>
  )
}

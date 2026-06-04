import { LoadingScreen } from './LoadingScreen'
import { useQuizStore } from '../store/quizStore'
import { TEST_QUESTION_COUNT } from '../lib/taskChunks'

export function Quiz() {
  const questionNumber = useQuizStore((s) => s.questionNumber)
  const currentTask = useQuizStore((s) => s.currentTask)
  const loadStatus = useQuizStore((s) => s.loadStatus)
  const loadError = useQuizStore((s) => s.loadError)
  const selectedOption = useQuizStore((s) => s.selectedOption)
  const revealed = useQuizStore((s) => s.revealed)
  const correctCount = useQuizStore((s) => s.correctCount)
  const answeredCount = useQuizStore((s) => s.answeredCount)
  const showSerbian = useQuizStore((s) => s.showSerbian)
  const selectOption = useQuizStore((s) => s.selectOption)
  const checkAnswer = useQuizStore((s) => s.checkAnswer)
  const nextQuestion = useQuizStore((s) => s.nextQuestion)
  const toggleLanguage = useQuizStore((s) => s.toggleLanguage)
  const backToWelcome = useQuizStore((s) => s.backToWelcome)
  const reloadCurrentQuestion = useQuizStore((s) => s.reloadCurrentQuestion)

  if (loadStatus === 'loading' || !currentTask) {
    return (
      <LoadingScreen
        message="Загрузка вопроса…"
        error={loadStatus === 'error' ? loadError : null}
        onRetry={
          loadStatus === 'error' ? () => void reloadCurrentQuestion() : undefined
        }
      />
    )
  }

  const task = currentTask
  const isLast = questionNumber >= TEST_QUESTION_COUNT
  const isCorrect = revealed && selectedOption === task.correctIndex
  const progressPct = Math.round((questionNumber / TEST_QUESTION_COUNT) * 100)

  return (
    <div className="quiz">
      <header className="quiz__header">
        <div className="quiz__meta">
          <span className="quiz__badge">A1</span>
          <span className="quiz__topic">{task.topic}</span>
        </div>
        <div className="quiz__controls">
          <button type="button" className="btn btn--ghost" onClick={toggleLanguage}>
            {showSerbian ? 'RU' : 'SR'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={backToWelcome}>
            Выход
          </button>
        </div>
      </header>

      <div className="quiz__stats">
        <span>
          Вопрос {questionNumber} / {TEST_QUESTION_COUNT}
        </span>
        <span>
          Верно: {correctCount} / {answeredCount}
        </span>
      </div>

      <div className="quiz__progress" aria-hidden>
        <div className="quiz__progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <section className="quiz__card">
        <h1 className="quiz__question">
          {showSerbian ? task.task_sr : task.task_ru}
        </h1>

        <ul className="quiz__options" role="listbox" aria-label="Варианты ответа">
          {task.options.map((option, index) => {
            let optionClass = 'quiz__option'
            if (selectedOption === index) optionClass += ' quiz__option--selected'
            if (revealed) {
              if (index === task.correctIndex) optionClass += ' quiz__option--correct'
              else if (selectedOption === index) optionClass += ' quiz__option--wrong'
            }

            return (
              <li key={index}>
                <button
                  type="button"
                  className={optionClass}
                  disabled={revealed}
                  onClick={() => selectOption(index)}
                  role="option"
                  aria-selected={selectedOption === index}
                >
                  {option}
                </button>
              </li>
            )
          })}
        </ul>

        {revealed && (
          <div
            className={`quiz__feedback ${isCorrect ? 'quiz__feedback--ok' : 'quiz__feedback--err'}`}
          >
            <strong>{isCorrect ? 'Верно!' : 'Неверно'}</strong>
            <p>{showSerbian ? task.explanation_sr : task.explanation_ru}</p>
          </div>
        )}
      </section>

      <footer className="quiz__footer">
        {!revealed ? (
          <button
            type="button"
            className="btn btn--primary"
            disabled={selectedOption === null}
            onClick={checkAnswer}
          >
            Проверить
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => void nextQuestion()}
          >
            {isLast ? 'Завершить тест' : 'Далее'}
          </button>
        )}
      </footer>
    </div>
  )
}

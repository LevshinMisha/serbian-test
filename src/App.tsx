import { Quiz } from './components/Quiz'
import { ResultsScreen } from './components/ResultsScreen'
import { StartScreen } from './components/StartScreen'
import { useQuizStore } from './store/quizStore'

export default function App() {
  const screen = useQuizStore((s) => s.screen)

  return (
    <main className="app">
      {screen === 'welcome' && <StartScreen />}
      {screen === 'quiz' && <Quiz />}
      {screen === 'results' && <ResultsScreen />}
    </main>
  )
}

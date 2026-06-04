import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '../types/task'
import {
  fetchChunk,
  pickRandomTask,
  prefetchChunk,
  TEST_QUESTION_COUNT,
} from '../lib/taskChunks'

type Screen = 'welcome' | 'quiz' | 'results'
type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

function prefetchAhead(questionNumber: number): void {
  prefetchChunk(questionNumber + 1)
  prefetchChunk(questionNumber + 2)
}

type QuizState = {
  screen: Screen
  loadStatus: LoadStatus
  loadError: string | null
  questionNumber: number
  currentTask: Task | null
  selectedOption: number | null
  revealed: boolean
  correctCount: number
  answeredCount: number
  showSerbian: boolean

  startTest: () => Promise<void>
  selectOption: (index: number) => void
  checkAnswer: () => void
  nextQuestion: () => Promise<void>
  reloadCurrentQuestion: () => Promise<void>
  toggleLanguage: () => void
  backToWelcome: () => void
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      screen: 'welcome',
      loadStatus: 'idle',
      loadError: null,
      questionNumber: 0,
      currentTask: null,
      selectedOption: null,
      revealed: false,
      correctCount: 0,
      answeredCount: 0,
      showSerbian: false,

      startTest: async () => {
        set({
          screen: 'quiz',
          loadStatus: 'loading',
          loadError: null,
          questionNumber: 1,
          currentTask: null,
          selectedOption: null,
          revealed: false,
          correctCount: 0,
          answeredCount: 0,
        })
        try {
          const chunk = await fetchChunk(1)
          prefetchAhead(1)
          set({
            currentTask: pickRandomTask(chunk),
            loadStatus: 'ready',
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Ошибка загрузки'
          set({ loadStatus: 'error', loadError: message, screen: 'welcome' })
        }
      },

      selectOption: (index) => {
        if (get().revealed) return
        set({ selectedOption: index })
      },

      checkAnswer: () => {
        const { currentTask, selectedOption, revealed, correctCount, answeredCount, questionNumber } =
          get()
        if (revealed || selectedOption === null || !currentTask) return
        const isCorrect = selectedOption === currentTask.correctIndex
        set({
          revealed: true,
          answeredCount: answeredCount + 1,
          correctCount: correctCount + (isCorrect ? 1 : 0),
        })
        prefetchAhead(questionNumber)
      },

      nextQuestion: async () => {
        const { questionNumber, revealed } = get()
        if (!revealed) return

        if (questionNumber >= TEST_QUESTION_COUNT) {
          set({ screen: 'results' })
          return
        }

        const next = questionNumber + 1
        set({
          loadStatus: 'loading',
          loadError: null,
          currentTask: null,
          selectedOption: null,
          revealed: false,
        })

        try {
          const chunk = await fetchChunk(next)
          prefetchAhead(next)
          set({
            questionNumber: next,
            currentTask: pickRandomTask(chunk),
            loadStatus: 'ready',
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Ошибка загрузки'
          set({ loadStatus: 'error', loadError: message })
        }
      },

      reloadCurrentQuestion: async () => {
        const { questionNumber } = get()
        if (questionNumber < 1) return

        set({ loadStatus: 'loading', loadError: null, currentTask: null })

        try {
          const chunk = await fetchChunk(questionNumber)
          prefetchAhead(questionNumber)
          set({
            currentTask: pickRandomTask(chunk),
            loadStatus: 'ready',
            selectedOption: null,
            revealed: false,
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Ошибка загрузки'
          set({ loadStatus: 'error', loadError: message })
        }
      },

      toggleLanguage: () => set((s) => ({ showSerbian: !s.showSerbian })),

      backToWelcome: () =>
        set({
          screen: 'welcome',
          loadStatus: 'idle',
          loadError: null,
          questionNumber: 0,
          currentTask: null,
          selectedOption: null,
          revealed: false,
          correctCount: 0,
          answeredCount: 0,
        }),
    }),
    {
      name: 'serbian-quiz-a1',
      partialize: (state) => ({
        showSerbian: state.showSerbian,
      }),
    },
  ),
)

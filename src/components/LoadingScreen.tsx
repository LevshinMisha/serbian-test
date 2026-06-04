type Props = {
  message: string
  error?: string | null
  onRetry?: () => void
}

export function LoadingScreen({ message, error, onRetry }: Props) {
  return (
    <div className="screen screen--center">
      <p className="screen__message">{error ?? message}</p>
      {error && onRetry && (
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  )
}

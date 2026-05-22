export function ThreeDotsLoader() {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label="Loading" role="status">
      <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
      <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
      <span className="size-1.5 rounded-full bg-foreground/40 animate-bounce" />
    </div>
  )
}

type DecoratorProps = {
  children: React.ReactNode
}

export function DecoratorScreenCenter(props: DecoratorProps) {
  const { children } = props
  return (
    <div className="flex justify-center items-center">
      {children}
    </div>
  )
}

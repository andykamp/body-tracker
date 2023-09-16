type DecoratorProps = {
  children: React.ReactNode
}

export function DecoratorScreenCenter(props: DecoratorProps) {
  const { children } = props
  return (
    <div className="h-full w-full flex justify-center items-center">
      {children}
    </div>
  )
}

'use client'

import * as React from 'react'

import { cn } from '@/chat/lib/utils'

// import * as SeparatorPrimitive from '@radix-ui/react-separator'
// const Separator = React.forwardRef<
//   React.ElementRef<typeof SeparatorPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
// >(
//   (
//     { className, orientation = 'horizontal', decorative = true, ...props },
//     ref
//   ) => (
//     <SeparatorPrimitive.Root
//       ref={ref}
//       decorative={decorative}
//       orientation={orientation}
//       className={cn(
//         'shrink-0 bg-border',
//         orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
//         className
//       )}
//       {...props}
//     />
//   )
// )
// Separator.displayName = SeparatorPrimitive.Root.displayName

// export { Separator }

export type SeparatorProps = React.ComponentProps<'div'> & {
    orientation?: 'horizontal' | 'vertical'

}
export function Separator(props:SeparatorProps) {
  const { className, orientation = 'horizontal', ...divProps } = props

  return (
    <div
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...divProps}
    />
  )
}

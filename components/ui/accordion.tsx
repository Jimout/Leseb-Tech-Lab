'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b last:border-b-0', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  indicator = 'default',
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** `sidebar`: chevron points right when closed, rotates down when open (nav sections). */
  indicator?: 'default' | 'sidebar'
}) {
  const isSidebar = indicator === 'sidebar'

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
          isSidebar
            ? '[&[data-state=open]>svg]:rotate-90'
            : '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        {isSidebar ? (
          <ChevronRightIcon
            className="pointer-events-none size-4 shrink-0 text-white/45 transition-transform duration-300 ease-out motion-reduce:transition-none"
            aria-hidden
          />
        ) : (
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-300 ease-in-out motion-reduce:transition-none" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  variant = 'default',
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & {
  variant?: 'default' | 'sidebar'
}) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        'overflow-hidden text-sm',
        variant === 'sidebar'
          ? 'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
          : 'grid transition-[grid-template-rows,opacity] duration-200 ease-out data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100',
        className,
      )}
      {...props}
    >
      <div className={cn('min-h-0', variant === 'sidebar' ? 'pb-2 pt-0' : 'pb-4 pt-0')}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

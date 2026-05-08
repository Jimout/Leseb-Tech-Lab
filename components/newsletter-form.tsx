'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const newsletterFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  notifyWork: z.boolean().optional().default(true),
  notifyInsights: z.boolean().optional().default(true),
  notifyImportant: z.boolean().optional().default(true),
})

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>

export type NewsletterFormProps = {
  className?: string
  formClassName?: string
  emailFieldClassName?: string
  inputClassName?: string
  buttonClassName?: string
  placeholder?: string
  buttonVariant?: ComponentProps<typeof Button>['variant']
}

export function NewsletterForm({
  className,
  formClassName,
  emailFieldClassName,
  inputClassName,
  buttonClassName,
  placeholder = 'your@email.com',
  buttonVariant,
}: NewsletterFormProps = {}) {
  const accentCta = buttonVariant == null || buttonVariant === 'default'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: '',
      notifyWork: true,
      notifyInsights: true,
      notifyImportant: true,
    },
  })

  async function onSubmit(values: NewsletterFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      toast({
        title: 'Check your inbox',
        description:
          'Please confirm your subscription from the email we sent. You’ll receive updates when I publish new projects or insights. No spam.',
      })
      form.reset()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('w-full', className)}>
        <div className={cn('flex gap-2', formClassName)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={cn('flex-1', emailFieldClassName)}>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={placeholder}
                    className={inputClassName}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={buttonVariant ?? 'default'}
            disabled={isSubmitting}
            className={cn(
              accentCta && 'bg-accent text-accent-foreground hover:bg-accent/90',
              buttonClassName,
            )}
          >
            {isSubmitting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              'Subscribe'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

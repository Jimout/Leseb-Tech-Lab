import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().max(40).optional().default(''),
  city: z.string().max(100).optional().default(''),
  project: z.string().min(10, 'Please share a few details about your project').max(5000),
  newsletter: z.boolean().optional().default(false),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

type MailPayload = {
  to: string
  subject: string
  html: string
  text: string
}

export class MailProviderNotConfiguredError extends Error {
  constructor() {
    super('Email provider not configured')
    this.name = 'MailProviderNotConfiguredError'
  }
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL ?? 'http://localhost:3000'
}

export function appBaseUrl() {
  return getBaseUrl()
}

export async function sendMail(payload: MailPayload) {
  const from = process.env.EMAIL_FROM
  const resendApiKey = process.env.RESEND_API_KEY
  if (!from || !resendApiKey) {
    throw new MailProviderNotConfiguredError()
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  })

  if (!response.ok) {
    const reason = await response.text()
    throw new Error(`Failed to send email: ${reason}`)
  }

  return { delivered: true as const }
}

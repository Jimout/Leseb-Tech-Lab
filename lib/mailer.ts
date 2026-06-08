import nodemailer from 'nodemailer'

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

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    
    console.log('📧 Configuring SMTP transporter...')
    console.log('   Host:', smtpHost)
    console.log('   User:', smtpUser)
    console.log('   Has password:', !!smtpPass)
    
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('❌ SMTP configuration missing')
      throw new MailProviderNotConfiguredError()
    }
    
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  }
  return transporter
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.APP_URL ?? 'http://localhost:3000'
}

export function appBaseUrl() {
  return getBaseUrl()
}

export async function sendMail(payload: MailPayload) {
  try {
    const transporter = getTransporter()
    const from = process.env.SMTP_FROM || process.env.SMTP_USER
    
    if (!from) {
      throw new MailProviderNotConfiguredError()
    }
    
    console.log(`📧 Sending email via SMTP to: ${payload.to}`)
    console.log(`   Subject: ${payload.subject}`)
    console.log(`   From: ${from}`)
    
    // Verify connection
    await transporter.verify()
    console.log('   ✅ SMTP connection verified')
    
    const info = await transporter.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    })
    
    console.log(`✅ Email sent successfully: ${info.messageId}`)
    return { delivered: true as const, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Failed to send email:', error)
    throw error
  }
}
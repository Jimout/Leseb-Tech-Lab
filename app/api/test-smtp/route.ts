import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    console.log('Testing SMTP configuration...')
    console.log('SMTP_USER:', process.env.SMTP_USER)
    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Verify connection
    await transporter.verify()
    console.log('✅ SMTP connection verified')

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'mesiori21@gmail.com',
      subject: 'Test Email from Leseb',
      html: '<h1>Test Successful!</h1><p>Your email configuration is working.</p>',
      text: 'Test Successful! Your email configuration is working.',
    })

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId 
    })
  } catch (error) {
    console.error('❌ SMTP test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
import { appBaseUrl } from '@/lib/mailer'

type EmailLayoutInput = {
  eyebrow?: string
  title: string
  lead?: string
  ctaLabel?: string
  ctaUrl?: string
  bodyHtml?: string
  footerNote?: string
  preferencesUrl?: string
  unsubscribeUrl?: string
  logoUrl?: string
  brandName?: string
}

function absoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url
  const base = appBaseUrl().replace(/\/+$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

export function renderBrandedEmail(input: EmailLayoutInput) {
  const homeUrl = appBaseUrl()
  const brandName = input.brandName ?? 'Leseb Tech Lab'
  const logoUrl = input.logoUrl ?? process.env.EMAIL_LOGO_URL ?? `${homeUrl}/images/Logo.png`
  const ctaUrl = input.ctaUrl ? absoluteUrl(input.ctaUrl) : null
  const bodyHtml = input.bodyHtml ?? ''
  const footerNote = input.footerNote ?? 'You are receiving this because you subscribed for updates.'

  const html = `
  <div style="margin:0;padding:24px;background:#f4f4f5;font-family:Inter,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="height:4px;background:linear-gradient(90deg,#facc15,#f59e0b);"></td>
      </tr>
      <tr>
        <td style="padding:24px 28px 8px 28px;">
          <a href="${homeUrl}" style="text-decoration:none;">
            <img
              src="${logoUrl}"
              alt="${brandName}"
              width="148"
              style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:148px;"
            />
          </a>
          <div style="margin-top:8px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;font-weight:600;">
            ${brandName}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 10px 28px;">
          ${input.eyebrow ? `<p style="margin:0 0 10px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;">${input.eyebrow}</p>` : ''}
          <h1 style="margin:0;font-size:28px;line-height:1.2;color:#111827;">${input.title}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 24px 28px;">
          ${input.lead ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563;">${input.lead}</p>` : ''}
          ${bodyHtml}
          ${
            ctaUrl && input.ctaLabel
              ? `<p style="margin:20px 0 0"><a href="${ctaUrl}" style="display:inline-block;background:#facc15;color:#111827;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:10px;">${input.ctaLabel}</a></p>`
              : ''
          }
        </td>
      </tr>
      <tr>
        <td style="padding:18px 28px 24px;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 8px;font-size:12px;color:#6b7280;">${footerNote}</p>
          <p style="margin:0;font-size:12px;">
            ${
              input.preferencesUrl
                ? `<a href="${absoluteUrl(input.preferencesUrl)}" style="color:#6b7280;">Manage preferences</a>`
                : ''
            }
            ${
              input.preferencesUrl && input.unsubscribeUrl
                ? '<span style="color:#9ca3af;"> · </span>'
                : ''
            }
            ${
              input.unsubscribeUrl
                ? `<a href="${absoluteUrl(input.unsubscribeUrl)}" style="color:#6b7280;">Unsubscribe</a>`
                : ''
            }
          </p>
        </td>
      </tr>
    </table>
  </div>
  `

  const textParts = [
    input.eyebrow ?? '',
    input.title,
    input.lead ?? '',
    ctaUrl && input.ctaLabel ? `${input.ctaLabel}: ${ctaUrl}` : '',
    input.preferencesUrl ? `Manage preferences: ${absoluteUrl(input.preferencesUrl)}` : '',
    input.unsubscribeUrl ? `Unsubscribe: ${absoluteUrl(input.unsubscribeUrl)}` : '',
  ].filter(Boolean)

  return { html, text: textParts.join('\n\n') }
}

import 'dotenv/config'

const BASE_URL = process.env.MEDIA_SMOKE_BASE_URL || 'http://localhost:3000'
const SESSION = process.env.MEDIA_SMOKE_SESSION || ''

function headers(contentType = false) {
  return {
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    ...(SESSION ? { 'x-session': SESSION } : {}),
  }
}

async function assertStatus(name: string, response: Response, allowed: number[]) {
  if (!allowed.includes(response.status)) {
    const body = await response.text().catch(() => '')
    throw new Error(`${name} failed with status ${response.status}. Body: ${body}`)
  }
  console.log(`${name}: ${response.status}`)
}

async function main() {
  console.log(`Running media API smoke against ${BASE_URL}`)
  const uploadMalformed = await fetch(`${BASE_URL}/api/upload-media`, {
    method: 'POST',
    headers: headers(),
    body: new FormData(),
  })
  await assertStatus('upload malformed', uploadMalformed, [400, 401, 403])

  const deleteMalformed = await fetch(`${BASE_URL}/api/upload-media`, {
    method: 'DELETE',
    headers: headers(true),
    body: JSON.stringify({}),
  })
  await assertStatus('delete malformed', deleteMalformed, [400, 401, 403])

  const workBadPayload = await fetch(`${BASE_URL}/api/admin/work-rows`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ rows: [{ id: 'x' }] }),
  })
  await assertStatus('work bad payload', workBadPayload, [400, 401, 403])

  const insightBadPayload = await fetch(`${BASE_URL}/api/admin/insights`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ insights: [{ id: 'x' }] }),
  })
  await assertStatus('insight bad payload', insightBadPayload, [400, 401, 403])

  console.log('Smoke checks complete.')
}

main().catch((error) => {
  console.error('media-api-smoke failed:', error)
  process.exitCode = 1
})

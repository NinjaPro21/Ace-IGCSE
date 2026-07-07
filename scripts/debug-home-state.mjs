import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173/'
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()
const errors = []

page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`))

// Simulate corrupted / heavy local state that could crash real browsers
await context.addInitScript(() => {
  localStorage.setItem('enlight-progress-v2', '{broken json')
  localStorage.setItem('enlight-social-v1', '{"pendingGroup":{"action":"joinClan"}}')
  sessionStorage.setItem('enlight-walkthrough-step', '2')
})

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  const rootLen = (await page.locator('#root').innerHTML()).length
  console.log('URL', url, 'ROOT_LEN', rootLen, 'ERRORS', errors.length)
  for (const e of errors) console.log(e)
} finally {
  await browser.close()
}

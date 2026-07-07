import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173/'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const errors = []
const failed = []

page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}\n${e.stack ?? ''}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`CONSOLE: ${m.text()}`)
})
page.on('requestfailed', (r) => failed.push(`REQ_FAIL: ${r.url()} — ${r.failure()?.errorText}`))

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(3000)
  const rootHtml = await page.locator('#root').innerHTML()
  const bodyText = await page.locator('body').innerText()
  console.log('URL', url)
  console.log('ROOT_LEN', rootHtml.length)
  console.log('BODY_TEXT_LEN', bodyText.length)
  console.log('TITLE', await page.title())
  if (failed.length) {
    console.log('FAILED_REQUESTS')
    for (const f of failed) console.log(f)
  }
  if (errors.length) {
    console.log('ERRORS')
    for (const err of errors) console.log('---\n' + err)
  } else {
    console.log('NO_JS_ERRORS')
  }
  if (rootHtml.length < 100) {
    console.log('ROOT_HTML', rootHtml || '(empty)')
  }
} catch (e) {
  console.log('GOTO_FAIL', e.message)
  if (failed.length) {
    console.log('FAILED_REQUESTS')
    for (const f of failed) console.log(f)
  }
  if (errors.length) {
    console.log('ERRORS')
    for (const err of errors) console.log('---\n' + err)
  }
} finally {
  await browser.close()
}

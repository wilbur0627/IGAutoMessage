const puppeteer = require('puppeteer')
// const sleep = require('./utils/sleep.js')

const screenshotHandler = async (page, name) => {
  await page.screenshot({ path: `測試用/${name}.png` })
}

const start = async () => {
  // 進入網頁
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:5500/test.html')
  await page.focus('textarea[placeholder=留言⋯⋯]')
  await page.keyboard.type('@0627sasa @simba.0626 測試2')
  await page.keyboard.press('Enter')
  await screenshotHandler(page, '測試functional')
  await browser.close()
}

start()

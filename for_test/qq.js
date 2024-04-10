const puppeteer = require('puppeteer')
const sleep = require('../utils/sleep.js')

const screenshotHandler = async (page, name) => {
  await page.screenshot({ path: `${name}.png` })
}

const messageHandler = async (page) => {
  let messageString = '2313213'
  await page.focus('textarea[placeholder=留言⋯⋯]')
  await page.keyboard.type(`${messageString}qqder`)
  await page.keyboard.press('Enter')
}

const start = async () => {
  // 進入網頁
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://127.0.0.1:5500/for_test/test.html')
  await sleep(2000)
  await messageHandler(page)
  await screenshotHandler(page, 'qq')
  await browser.close()
}

start()

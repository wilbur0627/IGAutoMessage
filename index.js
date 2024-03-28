const puppeteer = require('puppeteer')
const prompt = require('prompt-sync')()
const sleep = require('./utils/sleep.js')
// 可標記的帳號
const accounts = require('./temp/accounts.js')

// 一次需要標記人數
const counts = 2

/** 自動留言處理函式
 * @type { function(page): Promise<void> }
 * @param { puppeteer.Page } page
 */
const messageHandler = async (page) => {
  console.log('已開始自動留言....')
  let ori_accounts = [...accounts]
  let removed
  while (ori_accounts.length >= counts) {
    removed = ori_accounts.splice(0, counts)
    let messageString = ''
    for (let i = 0; i < removed.length; i++) {
      messageString += `@${removed[i]} `
    }
    await page.focus('textarea[placeholder=留言⋯⋯]')
    await page.keyboard.type(`${messageString}測試`)
    await page.keyboard.press('Enter')
    console.log(`已留言 "${messageString}測試"`)
    // 需要檢查是否已不夠標記，避免白等時間
    if (ori_accounts.length < counts) break
    await sleep(60000)
  }
  console.log('可標記帳號不足，結束自動留言....')
}

const start = async () => {
  // 進入網頁
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.instagram.com/')
  await page.waitForSelector('.system-fonts--body')
  await sleep(1000)
  await page.screenshot({ path: '進入網頁.png' })

  // 輸入帳號密碼
  await page.focus('input[name=username]')
  await page.keyboard.type('yhes914310@gmail.com')
  await page.focus('input[name=password]')
  await page.keyboard.type('wilbur825882')
  await page.screenshot({ path: '輸入帳號密碼.png' })

  // 按下登入
  await page.$eval('button[type=submit]', (button) => button.click())
  await sleep(15000)

  // 輸入備用簡訊驗證碼並送出
  const buttons = await page.$$('button')
  for (let button of buttons) {
    const buttonContent = await page.evaluate((el) => el.textContent, button)
    if (buttonContent === '備用驗證碼') {
      await button.click()
      await page.screenshot({ path: '進入到輸入備用驗證碼畫面.png' })
      break
    }
  }
  const verificationCode = prompt('輸入備用驗證碼：')
  await page.focus('input[name=verificationCode]')
  await page.keyboard.type(verificationCode)
  await page.$eval('button[type=button]', (button) => button.click())
  await page.screenshot({ path: '備用驗證碼送出.png' })
  await sleep(15000)

  let postUrl = ''
  while (postUrl !== 'q') {
    // 前往貼文
    postUrl = prompt('請輸入抽獎貼文網址：')
    await page.goto(postUrl)
    await page.waitForSelector('.system-fonts--body')
    await sleep(1000)

    // 輸入留言
    await messageHandler(page)
    postUrl = ''
  }

  // 截圖
  // await page.screenshot({ path: '最後截圖.png' })

  await browser.close()
}

start()

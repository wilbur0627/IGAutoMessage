const puppeteer = require('puppeteer')
const prompt = require('prompt-sync')()
const sleep = require('./utils/sleep.js')
// 可標記的帳號
const accounts = require('./temp/accounts.js')

// 每次需要標記人數
const counts = prompt('每次需要標記的人數：')

/** 自動留言處理函式
 * @type { function(page): Promise<void> }
 * @param { puppeteer.Page } page
 */
const messageHandler = async (page) => {
  function getRandomSleepTime() {
    const min = 180000
    const max = 600000
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
    console.log(`下次留言等待時間為${randomNumber}毫秒`)
    return randomNumber
  }
  await page.screenshot({ path: '進入貼文.png' })
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
    await page.keyboard.type(`${messageString}買安全帽找海爾`, { delay: 100 })
    await page.keyboard.press('Enter')
    await page.screenshot({ path: '每次留言的截圖.png' })
    console.log(`已留言 "${messageString}買安全帽找海爾"`)
    // 需要檢查是否已不夠標記，避免白等時間
    if (ori_accounts.length < counts) break
    await sleep(getRandomSleepTime())
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
  const account = prompt('輸入帳號：')
  await page.keyboard.type(account)
  await page.focus('input[name=password]')
  const password = prompt('輸入密碼：')
  await page.keyboard.type(password)
  await page.screenshot({ path: '輸入帳號密碼.png' })

  // 按下登入
  await page.$eval('button[type=submit]', (button) => button.click())
  await sleep(15000)

  // 輸入備用簡訊驗證碼並送出
  let needVerify = true
  const buttons = await page.$$('button')
  for (let button of buttons) {
    const buttonContent = await page.evaluate((el) => el.textContent, button)
    if (buttonContent === '備用驗證碼') {
      await button.click()
      await page.screenshot({ path: '進入到輸入備用驗證碼畫面.png' })
      break
    } else {
      needVerify = false
    }
  }
  if (needVerify) {
    const verificationCode = prompt('輸入備用驗證碼：')
    await page.focus('input[name=verificationCode]')
    await page.keyboard.type(verificationCode)
    await page.$eval('button[type=button]', (button) => button.click())
    await page.screenshot({ path: '備用驗證碼送出.png' })
    await sleep(15000)
  }

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

const sleep = require('../utils/sleep.js')
const prompt = require('prompt-sync')()

const a = prompt('你好', '哈哈')

console.log(a)

// const inputHandler = async () => {
//   let nextText = ''
//   const endCondition = 3
//   while (nextText !== 'q') {
//     nextText = prompt('輸入文字：')
//     if (nextText === 'q') break
//     for (let i = 1; i <= endCondition; i++) {
//       console.log(i)
//       if (i === endCondition) {
//         nextText = ''
//       }
//       await sleep(1000)
//     }
//   }
// }
// inputHandler()

// const takeArrayHandler = (counts) => {
//   const a = [1, 2, 3, 4, 5, 6, 7]
//   let ori = [...a]
//   let removed = []
//   while (ori.length >= counts) {
//     removed = ori.splice(0, counts)
//     console.log(removed)
//   }
// }

// takeArrayHandler(2)

/**
 * Author：SamLiu
 * Date: 22.3.1
 * Description:
 */

import * as cheerio from 'cheerio';
import fetch from "node-fetch"
import fs from 'fs'

import {module, wordsType, siteUrl, requestHeader} from "./config.js";

const args = process.argv.slice(2)

// 请求模块节点
const requestNode = module[args[0]]['node']
const request = await fetch(`${siteUrl}/topics/ezone/nodes/${requestNode}`, requestHeader)
// 文件名
const fileTitle = `${module[args[0]]['name']}${wordsType[args[1]]}`

// 页面内容
const pageContent = cheerio.default.load(await request.text())
// 原始的文章列表数据
const articleListOrigin = pageContent('.materials li a')
// 处理后的文章列表
const articleList = []

//获取当前模块中文章的标题和url
for (let i = 0; i < articleListOrigin.length; i++) {
  const current = articleListOrigin.eq(i)
  articleList.push({
    url: current.attr('href'),
    title: current.text()
  })
}

// 计数
let count = 0

// 获取每篇文章的划线句
articleList.forEach(async function (item) {
  const articlePage = await fetch(`${siteUrl}${item.url}`, requestHeader)
  const articlePageContent = cheerio.default.load(await articlePage.text())

  // 获取所有标注的内容
  const markContentArr = articlePageContent('em')

  item.markContent = []

  for (let i = 0; i < markContentArr.length; i++) {
    item.markContent.push(markContentArr.eq(i).text())
  }
  count +=1
})

// 生成文件
function writeFile() {
  // 文件标题
  fs.writeFileSync(`${fileTitle}.md`,  `# ${fileTitle} \n \n`, {flag: 'a+'})

  articleList.forEach((e, i) => {
    // 子标题
    fs.writeFileSync(`${fileTitle}.md`,  `## ${i + 1}. ${e.title}\n \n`, {flag: 'a+'})
    e.markContent.forEach(t =>{
      // 划线内容
      fs.writeFileSync(`${fileTitle}.md`, `${t}\n \n`, { flag: 'a+' })
    })
  })
}

// 两秒查一次
const waitForWrite = setInterval(() => {
  if (count === articleList.length) {
    console.log(`ETF拯救世界金句合集${fileTitle}打印完毕，请在当前目录查找相关文件。`)
    writeFile()
    clearInterval(waitForWrite)
  } else {
    console.log('打印中，请稍后...  :)')
  }

}, 2000)


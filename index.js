/**
 * Author：SamLiu
 * Date: 22.3.1
 * Description:
 */

import * as cheerio from 'cheerio';
import fetch from "node-fetch"
import fs from 'fs'


// 不同板块对应的节点
const nodes = 2
// 官网链接
const siteUrl = 'https://youzhiyouxing.cn'
// 请求头
const requestHeader = {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "cache-control": "no-cache",
    "pragma": "no-cache",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "_flourish_data=SFMyNTY.g2gDdAAAAAFkAAlkZXZpY2VfaWRtAAAAJGMyMjNjNTdiLTNlMjktNGYyYS05ZGYzLTMwYmU3MGQ3NGE4YW4GAKGcZ0V_AWIAAVGA.GPqP8bDC3YsQZwWVQUGx_fdpOrMmnPtjRhswcA6oPuo; _flourish_key=SFMyNTY.g3QAAAAEbQAAAAtfY3NyZl90b2tlbm0AAAAYTjZXTTF0eXVJUWhETDZZbUwxSWR3c1RNbQAAAAxhY2Nlc3NfdG9rZW5tAAAAl1NGTXlOVFkuZzJnRGJRQUFBRFJvVm5sRmRFOUVSMk5ZYjJwSGNYQjJXVGhNVFRCUFluUmpaR1I0SzJGcVJVbG1MeXREYVU5dWNYbzRKREpoSkRJME5UazRiZ1lBRlhFVThYNEJZZ0FCVVlBLmpxNjBLZUNoREYtV1BYV3JPbzNMUnVuWm50U0xKRUZaZkpiNkI3NFVCRU1tAAAAB3Byb2ZpbGV0AAAABGQACl9fc3RydWN0X19kABdFbGl4aXIuRmxvdXJpc2guUHJvZmlsZWQAEWlzX3Bhc3N3b3JkX2VtcHR5ZAAEdHJ1ZWQAC3JlbmV3X3Rva2VuZAADbmlsZAAEdXNlcnQAAAAGZAAKX19zdHJ1Y3RfX2QAHEVsaXhpci5GbG91cmlzaC5Qcm9maWxlLlVzZXJkAAphdmF0YXJfdXJsbQAAAE5odHRwczovL2F2YXRhci55b3V6aGl5b3V4aW5nLmNuL3VzZXIvMjAyMC8xMi8wMi8wMUVSR1dZSzJHQlY5QTg2RjU3RFExMEhZSy5qcGdkAApjcmVhdGVkX2F0dAAAAA1kAApfX3N0cnVjdF9fZAAPRWxpeGlyLkRhdGVUaW1lZAAIY2FsZW5kYXJkABNFbGl4aXIuQ2FsZW5kYXIuSVNPZAADZGF5YQJkAARob3VyYQxkAAttaWNyb3NlY29uZGgCYQBhAGQABm1pbnV0ZWE4ZAAFbW9udGhhDGQABnNlY29uZGEqZAAKc3RkX29mZnNldGEAZAAJdGltZV96b25lbQAAAAlFdGMvVVRDKzhkAAp1dGNfb2Zmc2V0YgAAcIBkAAR5ZWFyYgAAB-RkAAl6b25lX2FiYnJtAAAAAyswOGQAAmlkYgAAYBZkAAhuaWNrbmFtZW0AAAAJ5YiY5LiA56yUZAAFcGhvbmVtAAAACzEzMTcwODY0Mjk4bQAAAAdyZWZlcmVybQAAACZodHRwczovL3lvdXpoaXlvdXhpbmcuY24vbWF0ZXJpYWxzLzY3Mw.TzGubITBbnysnLq6FZ1O-FDOsvv8uTFqrlIxqt_bdOY",
    "Referer": "https://youzhiyouxing.cn/topics/ezone/nodes/2",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
}
const request = await fetch(`${siteUrl}/topics/ezone/nodes/${nodes}`, requestHeader)

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
  articleList.forEach((e, i) => {
    // 标题
    fs.writeFileSync('sentence.md',  `## ${i + 1}. ${e.title}\n \n`, {flag: 'a+'})
    e.markContent.forEach(t =>{
      fs.writeFileSync('sentence.md', `${t}\n \n`, { flag: 'a+' })
    })
  })
}


// 两秒查一次
const waitForWrite = setInterval(() => {
  if (count === articleList.length) {
    writeFile()
    clearInterval(waitForWrite)
  } else {
    console.log('打印中，请稍后')
  }

}, 2000)


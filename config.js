/**
 * Author：Sam
 * Date: 22.3.2
 * Description: 项目相关请求配置
 */

// 模块类型
export const module = {
  idea: {
    name: '投资理念',
    node: 2
  },
  strategy: {
    name: '投资策略',
    node: 14
  },
  philosophy: {
    name: '人生哲学',
    node: 18
  }
}

// 划线类型
export const wordsType = {
  official: '官方标注版',
  hotLine: '热门划线版',
  personal: '个人划线版'
}

// 官网链接
export const siteUrl = 'https://youzhiyouxing.cn'

// 请求头
export const requestHeader = {
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
    "cookie": "xx",
    "Referer": "https://youzhiyouxing.cn/user/login",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
}

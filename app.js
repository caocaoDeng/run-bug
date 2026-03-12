const express = require('express')
const fs = require('fs')
const path = require('path')
const https = require('https')
const axios = require('axios')
const cheerio = require('cheerio')
const { imageSize } = require('image-size')

const app = express()
const url = 'https://www.xiaohongshu.com'

const getData = async () => {
  const notes = []
  const res = await axios.get(`${url}/explore`)
  const $ = cheerio.load(res.data)
  const elms = $('#exploreFeeds .note-item>div')
  elms.each((_, elm) => {
    const cover = $(elm).find('.cover')
    const footer = $(elm).find('.footer')
    notes.push({
      link: $(cover).attr('href'),
      cover: $(cover).find('img').attr('src'),
      title: $(footer).find('.title span').text(),
      avatar: $(footer)
        .find('.author-wrapper .author .author-avatar')
        .attr('src'),
      author: $(footer).find('.author-wrapper .author .name').text(),
      like: $(footer).find('.author-wrapper .like-wrapper .count').text(),
    })
  })
  return notes.map((item, index) => ({ ...item, _id: index }))
}

// 加载本地文件
const loadLocalFile = () => {
  const html = fs.readFileSync(path.join(__dirname, '1.html'), 'utf-8')
  const $ = cheerio.load(html)
  const elms = $('.swiper-wrapper>.swiper-slide')
  return elms.map((_, elm) => $(elm).find('img').attr('src')).toArray()
}

// const getImageSizeFromUrl = url => {
//   return new Promise((resolve, reject) => {
//     https
//       .get(url, res => {
//         const chunks = []

//         res.on('data', chunk => chunks.push(chunk))

//         res.on('end', () => {
//           try {
//             const buffer = Buffer.concat(chunks)
//             const dimensions = imageSize(buffer)
//             console.log(dimensions)
//             resolve(dimensions)
//           } catch (error) {
//             reject(error)
//           }
//         })
//       })
//       .on('error', reject)
//   })
// }

// getImageSizeFromUrl(
//   'https://sns-webpic-qc.xhscdn.com/202510161644/a3239140beb37e05462edc0c4fe5a30d/1000g0082dvegpb0ha0005o1jj0qg85bbsu26pcg!nc_n_nwebp_mw_1'
// )

app.get('/', async (req, res) => {
  const notes = await loadLocalFile()
  res.send(notes)
})

app.listen(3000, () => {
  console.log('服务已连接')
})

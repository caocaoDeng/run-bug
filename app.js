const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

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

// https://www.xiaohongshu.com/explore/68ce0892000000001300621f?xsec_token=ABIltKV-AuNX6cWoFVYVupB1v6iNj6dyRGmvroG6th_RA=&xsec_source=pc_feed
const getDetail = async ({ link }) => {
  const imgs = []
  const res = await axios.get(
    'https://www.xiaohongshu.com/explore/68ce0892000000001300621f?xsec_token=ABIltKV-AuNX6cWoFVYVupB1v6iNj6dyRGmvroG6th_RA=&xsec_source=pc_feed'
  )
  const $ = cheerio.load(res.data)
  const elms = $('.swiper-wrapper .swiper-slide')
  console.log(elms.length)
  elms.each((_, elm) => {
    const src = $(elm).find('.img-container .note-slider-img').attr('src')
    imgs.push(src)
  })
  return imgs
}

app.get('/', async (req, res) => {
  const notes = await getData()
  // const imgs = await getDetail(notes[0])
  res.send(notes)
})

app.listen(3000, () => {
  console.log('服务已连接')
})

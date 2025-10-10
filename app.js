const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const getData = async () => {
  const notes = []
  const res = await axios.get('https://www.xiaohongshu.com/explore')
  const jq = cheerio.load(res.data)
  jq('#exploreFeeds .note-item>div').each((_, elm) => {
    const childs = elm.children.filter(item => !!item.name).slice(1)
    childs.forEach(item => {
      console.log(jq(item).attr('href'))
    })
    notes.push({
      link: jq(childs[1]).attr('href'),
      cover: jq(childs[1].children[0]).attr('src'),
      // title: jq(childs[2].children[0].children[0]).text(),
    })
  })
  return notes
}

app.get('/', async (req, res) => {
  const notes = await getData()
  res.send(notes)
})

app.listen(3000, () => {
  console.log('服务已连接')
})

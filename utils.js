const axios = require('axios')
const cheerio = require('cheerio')
const s = require('underscore.string')
const {
  cookie,
} = require('./config.json')

const numberPadZero = (number, zeroNum) => `${'0'.repeat(zeroNum - number.toString().length)}${number}`;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const request = (header) => axios.request(
  {
    ...{
      method: 'get',
      headers: {
        Cookie: cookie,
      },
    },
    ...header,
  }
).catch(err => {
  console.log(err)
})

const parseXpath = (xml, xpath, attr) => s.unescapeHTML(cheerio.load(xml)(xpath).attr(attr))

module.exports = {
  numberPadZero,
  sleep,
  request,
  parseXpath,
}

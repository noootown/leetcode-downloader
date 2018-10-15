const fs = require('fs')
const {
  numberPadZero,
  sleep,
  request,
  parseXpath
} = require('./utils')
const {
  SLEEP_TIME,
} = require('./config')

const dataPath = 'problem'

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath)
}

;(async () => {
  const problems = (await request(
    {
      url: 'https://leetcode.com/api/problems/all/',
    },
  )).data.stat_status_pairs.map(({
    stat: {
      question_id: id,
      question__title_slug: slug,
    },
  }) => ({ id, slug })).sort((a, b) => a.id - b.id)

  for (let problem of problems) {
    const { id, slug } = problem
    let idStr = numberPadZero(id, 4)
    const filename = `${idStr}-${slug}.txt`

    console.log(`Downloading ${slug}`)

    const { data: questionData } = await request({ url: `https://leetcode.com/problems/${slug}` })
    const questionText = parseXpath(questionData, 'head > meta[name="description"]', 'content')
    fs.writeFileSync(`${dataPath}/${filename}`, questionText)

    console.log(`Downloaded ${filename}`)

    await sleep(SLEEP_TIME)
  }
})();

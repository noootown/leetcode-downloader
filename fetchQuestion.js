const fs = require('fs')
const {
  numberPadZero,
  sleep,
  request,
  parseXpath
} = require('./utils')

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
    console.log(`Downloading ${slug}`)
    const { data } = await request({ url: `https://leetcode.com/problems/${slug}` })
    let idStr = numberPadZero(id, 4)
    const problemText = parseXpath(data, 'head > meta[name="description"]', 'content')
    const filename = `${idStr}-${slug}.txt`
    fs.writeFileSync(`${dataPath}/${filename}`, problemText)
    console.log(`Downloaded ${filename}`)

    await sleep(5000)
  }
})();

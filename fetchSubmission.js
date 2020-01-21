const fs = require('fs')
const {
  numberPadZero,
  sleep,
  request,
} = require('./utils')
const {
  SLEEP_TIME,
} = require('./config')

const extMap = {
  bash: 'sh',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  golang: 'go',
  java: 'java',
  javascript: 'js',
  mysql: 'sql',
  python: 'py',
  python3: 'py',
  ruby: 'rb',
  scala: 'scala',
  swift: 'swift',
}

const dataPath = 'submission'

if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath)
}

const solved = []

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
    const { data: { submissions_dump } } = await request({
      url: `https://leetcode.com/api/submissions/${slug}`,
    })
    const acceptedSubmission = submissions_dump.filter(({ status_display }) => status_display === 'Accepted')
    if (acceptedSubmission.length === 0) {
      await sleep(SLEEP_TIME)
      continue
    }
    console.log(`Downloading ${slug}`)
    const { url, lang } = acceptedSubmission[0]

    await sleep(SLEEP_TIME)

    const { data: codeData } = await request({
      url: `https://leetcode.com${url}`,
    })

    let idStr = numberPadZero(id, 4)
    const matches = codeData.match(/submissionCode: '(.*)',\n  editCodeUrl/)
    const code = `${
      matches[1].replace(/\\u[\dA-F]{4}/gi, match =>
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      )}\n`
    const filename = `${idStr}-${slug}.${extMap[lang]}`
    fs.writeFileSync(`${dataPath}/${filename}`, code)
    console.log(`Downloaded ${filename}`)

    await sleep(SLEEP_TIME)
  }
})()

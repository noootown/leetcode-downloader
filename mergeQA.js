const fs = require('fs')

let output = ''

const submissions = fs.readdirSync('submission')
  .map(filename => filename.match(/(\d+)([\w\d\-]+)\.\w+/))

submissions.forEach(submission => {
  const question = fs.readFileSync(`problem/${submission[1]}${submission[2]}.txt`)
  const solution = fs.readFileSync(`submission/${submission[0]}`)

  output += `
Question ${submission[1]}:
${question}

${solution}
--------------------------------------------

`
})

output = output.replace(/\n{3,}/g, '\n')

fs.writeFileSync(`leetcode.txt`, output)


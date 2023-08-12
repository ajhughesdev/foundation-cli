const fs = require('fs')
const path = require('path')

const {spawn} = require('child_process')

module.exports = function(args, options) {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log(`\nYou don't appear to be in a Foundation project folder.\n\nUse ${`pwd`.cyan} (or ${`chdir`.cyan} in Windows) to see what folder you're in.\n`)
    process.exit(0)
  }

  const args = ['build']

  const child = spawn('yarn', ['run-script', ...args], { stdio: 'inherit' })
  child.on('error', (err) => {
    console.error(err)
  })
  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`Process was killed by signal: ${signal}`)
    } else if (code !== 0) {
      console.log(`Process exited with code ${code}`)
    }
  })
}

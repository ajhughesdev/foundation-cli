const fs = require('fs')
const path = require('path')
const os = require('os')

const {exec} = require('child_process')

const platform = os.platform()

const platformResponse = function() {
  let r = ''
  if (['darwin','freebsd','linux','openbsd','sunos'].indexOf(platform) > -1)
    r = 'pwd'
  if (['win32'].indexOf(platform) > -1)
    r = 'chdir'
  if (r === '')
    r = 'the appropriate command'
  return `\nYou don't appear to be in a Foundation project folder.\n\nUse ${r.cyan} to see what folder you're in.\n`
}

module.exports = function() {
  // Check if the user is inside a project folder, by looking for a package.json
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log(platformResponse())
    process.exit(0)
  }

  const child = exec('npm run start')
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

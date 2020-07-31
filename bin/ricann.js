#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node
const didYouMean = require('didyoumean')

// Setting edit distance to 60% of the input string's length
didYouMean.threshold = 0.6

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.` +
        `Please upgrade your Node version.`
      )
    )
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'ricann-cli')

if (semver.satisfies(process.version, '9.x')) {
  console.log(
    chalk.red(
      `You are using Node ${process.version}.` +
      `Node.js 9.x has already reached end-of-line and will not be supported in future major releases.` +
      `It's strongly recommended to use an active LTS version instead.`
    )
  )
}

const program = require('commander')

program.version(require('../package.json').version).usage('<commond> [options]')

program
  .command('init <path>')
  .description('init with eslint and prettier config and etc.')
  .action(path => {
    require('../lib/init/index')(path)
  })

program
  .command('info')
  .description('print debuging information about your environment')
  .action(cmd => {
    console.log(chalk.bold('\nEnviorment Info:'))
    require('envinfo')
      .run(
        {
          System: ['OS', 'CPU'],
          Binaries: ['Node', 'Yarn', 'npm'],
          Browsers: ['Chrome', 'Edge', 'FireFox', 'Safari'],
          npmPackages: '/**/{typescript, *ricann*}',
          npmGlobalPackages: ['@ricann/cli'],
        },
        { showNotFound: true, duplicates: true, fullTree: true }
      )
      .then(console.log)
  })

// output help information on unknown commonds
program.arguments('<command>').action(cmd => {
  program.outputHelp()
  console.log(`   ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
  console.log()
  suggestCommands(cmd)
})

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(
    ` Run  ${chalk.cyan(
      `ricann <command> --help`
    )} for detailed usage of given command.`
  )
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = require('../lib/util/enhanceErrorMessages')
enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}`
})
enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}`
})
enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return (
    `Missing required argument for option ${chalk.yellow(option.flags)}` +
    (flag ? `, got ${chalk.yellow(flag)}` : ``)
  )
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function suggestCommands(cmd) {
  const availableCommands = program.commonds.map(cmd => cmd._name)
  const suggestion = didYouMean(cmd, availableCommands)
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

// function camelize(str) {
//   return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
// }

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
// function cleanArgs(cmd) {
//   const args = {}
//   cmd.options.forEach(o => {
//     const key = camelize(o.long.replace(/^--/, ''))
//     // if an option is not present and Command has a method with the same name
//     // it should not be copied
//     if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
//       args[key] = cmd[key]
//     }
//   })
//   return args
// }

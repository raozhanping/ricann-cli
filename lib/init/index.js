const fs = require('fs')
const path = require('path')
const globby = require('globby')
const { isBinaryFileSync } = require('isbinaryfile')
const resolve = require('resolve')
const ejs = require('ejs')
const writeFileTree = require('../util/writeFileTree')

module.exports = async function run(target) {
  /**
   * copy temp files to path
   */
  const context = path.resolve(process.cwd(), target)
  const source = path.resolve(__dirname, './temp')
  const parsedContext = path.parse(context)
  const files = await render(source, {
    rootOptions: { name: parsedContext.base },
  })
  await writeFileTree(context, files)
}

function extractCallDir() {
  // extract render() callsite file location using error stack
  const obj = {}
  Error.captureStackTrace(obj)
  const callSite = obj.stack.split('\n')[3]
  const filename = callSite.match(/\s\((.*):\d+:\d+\)$/)[1]
  return path.dirname(filename)
}
function resolveData(additionalData) {
  return Object.assign(
    { options: {}, rootOptions: {}, plugins: [] },
    additionalData
  )
}
async function render(source, additionalData = {}, ejsOptions = {}) {
  const files = {}
  const baseDir = extractCallDir()
  source = path.resolve(baseDir, source)

  const data = resolveData(additionalData)
  const _files = await globby(['**/*'], { cwd: source })
  for (const rawPath of _files) {
    const targetPath = rawPath
      .split('/')
      .map(filename => {
        // dotfiles are ignored when published to npm, therefore in templates
        // we need to use underscore instead (e.g. "_gitignore")
        if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
          return `.${filename.slice(1)}`
        }
        if (filename.charAt(0) !== '_' && filename.charAt(1) === '_') {
          return `${filename.slice(1)}`
        }
        return filename
      })
      .join('/')
    const sourcePath = path.resolve(source, rawPath)
    const content = renderFile(sourcePath, data, ejsOptions)
    // only set file if it's not all whitespace, or is a Buffer (binary files)
    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
      files[targetPath] = content
    }
  }

  return files
}

const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g

function renderFile(name, data, ejsOptions) {
  if (isBinaryFileSync(name)) {
    return fs.readFileSync(name) // return buffer
  }
  const template = fs.readFileSync(name, 'utf-8')

  // custom template inheritance via yaml front matter.
  // ---
  // extend: 'source-file'
  // replace: !!js/regexp /some-regex/
  // OR
  // replace:
  //    - !!js/regexp /foo/
  //    - !!js/regexp /bar/
  // ---
  const yaml = require('yaml-front-matter')
  const parsed = yaml.loadFront(template)
  const content = parsed.__content
  let finalTemplate = content.trim() + '\n'
  if (parsed.extend) {
    const extendPath = path.isAbsolute(parsed.extend)
      ? parsed.extend
      : resolve.sync(parsed.extend, { basedir: path.dirname(name) })
    finalTemplate = fs.readFileSync(extendPath, 'utf-8')
    if (parsed.replace) {
      if (Array.isArray(parsed.replace)) {
        const replaceMatch = content.match(replaceBlockRE)
        if (replaceMatch) {
          const replaces = replaceMatch.map(m => {
            return m.replace(replaceBlockRE, '$1').trim()
          })
          parsed.replace.forEach((r, i) => {
            finalTemplate = finalTemplate.replace(r, replaces[i])
          })
        }
      } else {
        finalTemplate = finalTemplate.replace(parsed.replace, content.trim())
      }
    }
  }
  if (parsed.when) {
    finalTemplate =
      `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`
  }
  return ejs.render(finalTemplate, data, ejsOptions)
}

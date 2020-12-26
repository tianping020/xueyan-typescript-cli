import { execSync } from 'child_process'
import fse, { Stats } from 'fs-extra'
import setByPath from 'lodash/set'
import { withPath, joinPath } from '../utils/path'
import { logErrorAndExit } from '../utils/print'
import { isPlainObject, isString } from 'lodash'
import { PackageInfo, AnyObject } from '../types'

/**
 * 深度遍历的节点信息
 */
export interface DeepReadNodeInfo {
  source: string,
  offset: string,
  current: string,
  stats: Stats
}

/**
 * 深度遍历读取各个文件的信息
 * 注：不会读取文件夹的信息
 * @param param0 
 * @private
 */
async function __deepReadByPath__({
  source,
  offset,
  current,
  filter,
  handler
}: {
  source: string
  offset: string
  current: string
  filter?: (node: DeepReadNodeInfo) => (boolean | Promise<boolean>)
  handler: (node: DeepReadNodeInfo) => (void | Promise<void>)
}) {
  const stats = fse.statSync(current)
  if (filter) {
    const isContinue = await filter({
      offset, source, current, stats
    })
    if (!isContinue) {
      return
    }
  }
  if (stats.isFile()) {
    await handler({ offset, source, current, stats })
  } else if (stats.isDirectory()) {
    const files = await fse.readdir(current)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      await __deepReadByPath__({
        filter,
        handler,
        source,
        offset: joinPath(offset, fileName),
        current: withPath(current, fileName),
      })
    }
  }
}

/**
 * 对深度遍历读取做一层封装
 * 屏蔽current、offset等接口
 * @param param0 
 */
export function deepReadByPath(
  source: string,
  handler: (node: DeepReadNodeInfo) => (void | Promise<void>),
  options: {
    filter?: (node: DeepReadNodeInfo) => (boolean | Promise<boolean>)
  } = {}
) {
  if (!fse.existsSync(source)) {
    logErrorAndExit(`Failed to read "${source}", please check whether the file is exists`)
  }
  return __deepReadByPath__({
    source,
    handler,
    offset: '',
    current: source,
    filter: options.filter,
  })
}

/**
 * 获取json信息
 * 若传入的值是string，则与relationPath拼接成路径，读取该路径的文件，出错则报错并退出
 * 若传入的值是object，则原样返回
 * 若是其他值，则返回undefined
 * @param {Any} value 指定传入的值
 * @param {String} relationPath 指定文件的参考目录 @default ''
 */
export function readJSONSyncByValue(value: any, relationPath: string = ''): AnyObject {
  try {
    if (isPlainObject(value)) {
      return value
    } else if (isString(value)) {
      const jsonPath = withPath(relationPath, value)
      if (!fse.existsSync(jsonPath)) {
        throw Error(`"${jsonPath}" does not exist`)
      }
      const jsonInfo = fse.readJSONSync(jsonPath)
      if (!isPlainObject(jsonInfo)) {
        throw Error(`Failed to read "${jsonPath}", please check whether the file content format is correct`)
      }
      return jsonInfo
    } else {
      return {}
    }
  } catch (err) {
    return logErrorAndExit(err)
  }
}

/**
 * 获取git全局配置信息
 */
export function readGitConfigSync(): AnyObject {
  const configStr = execSync(`git config --global --list`).toString()
  const config: AnyObject = {}
  configStr.split('\n').forEach(line => {
    if (line) {
      const flagIndex = line.indexOf('=')
      if (flagIndex > 0) {
        setByPath(config, line.slice(0, flagIndex), line.slice(flagIndex + 1))
      }
    }
  })
  return config
}

/**
 * 根据文件夹目录，获取包的信息
 * @param {String} dirPath 指定文件夹目录
 */
export function readPackageInfoSyncByPath(projectPath: string): PackageInfo {
  try {
    const packageInfo = readJSONSyncByValue('package.json', projectPath)
    if (!packageInfo.name || !packageInfo.version || !packageInfo.author) {
      throw Error('package.json must contain "name", "version", "author" fields')
    }
    return packageInfo as PackageInfo
  } catch (err) {
    return logErrorAndExit(err)
  }
}

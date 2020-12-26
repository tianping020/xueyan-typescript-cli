import { AnyObject, PackageInfo } from '../types'
import commander from 'commander'
import { withPath } from '../utils/path'

export interface RootProjectProps {
  path: string
  program: commander.Command
  package: PackageInfo
  config: AnyObject
}

export interface RootProjectConfig<T extends string> {
  type: T
}

export default abstract class RootProject<T extends string> {
  /**
   * 项目类型
   */
  readonly type: T

  /**
   * 项目名称
   */
  readonly name: string

  /**
   * 项目版本
   */
  readonly version: string

  /**
   * 作者
   */
  readonly author: string

  /**
   * 项目路径
   */
  readonly path: string

  /**
   * 当前运行的程序的信息
   */
  readonly program: commander.Command

  /**
   * 包的信息
   */
  readonly package: PackageInfo

  /**
   * 配置信息
   */
  readonly config: AnyObject

  /**
   * 初始化
   */
  constructor(type: T, props: RootProjectProps) {
    this.type = type
    this.path = props.path
    this.program = props.program
    this.package = props.package
    this.config = props.config
    this.name = props.package.name
    this.version = props.package.version
    this.author = props.package.author
  }

  /**
   * 确保是数组
   */
  ensureArray<T = any>(data?: T | T[]): T[] {
    if (Array.isArray(data)) {
      return data
    } else if (data) {
      return [data]
    } else {
      return []
    }
  }

  /**
   * 是否安装有 babel runtime
   */
  hasBabelRuntimeDep() {
    const dependencies = this.package.dependencies || {}
    return Boolean(dependencies['@babel/runtime'])
  }

  /**
   * 拼接路径
   */
  withPath(...pathList: string[]) {
    return withPath(this.path, ...pathList.filter(i => i))
  }
}

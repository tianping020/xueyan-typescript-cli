import Webpack, { Configuration, Compiler, Stats } from 'webpack'
import ReactApplicationProject from '../../../projects/react-application-project'
import { logSuccess } from '../../../utils/print'
import getModuleConfig from './get-module-config'
import getPluginsConfig from './get-plugins-config'
import getEntryConfig from './get-entry-config'
import getOutputConfig from './get-output-config'
import getResolveConfig from './get-resolve-config'
import getResolveLoaderConfig from './get-resolve-loader-config'
import getOptimizationConfig from './get-optimization-config'

/**
 * 项目编译器
 */
export default class ProjectBuilder {
  /**
   * 项目信息
   */
  readonly project: ReactApplicationProject

  /**
   * 代码编译器的配置项
   */
  readonly config: Configuration

  /**
   * 代码编译器
   */
  readonly compiler: Compiler

  /**
   * 构造器
   */
  constructor({
    project
  }: {
    project: ReactApplicationProject
  }) {
    this.config = {}
    this.project = project
    this.config.mode = 'production'
    this.config.devtool = 'cheap-module-source-map'
    this.config.entry = getEntryConfig(this)
    this.config.output = getOutputConfig(this)
    this.config.module = getModuleConfig(this)
    this.config.plugins = getPluginsConfig(this)
    this.config.resolve = getResolveConfig(this)
    this.config.resolveLoader = getResolveLoaderConfig(this)
    this.config.optimization = getOptimizationConfig(this)
    this.config.externals = project.moduleExternals
    this.compiler = Webpack(this.config)
  }

  /**
   * 构建
   */
  build(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.compiler.run((error: Error, stats: Stats) => {
        const project = this.project
        if (error) {
          console.error(error.stack || error)
          reject()
        } else if (stats.hasErrors()) {
          console.error(stats.toString('errors-only'))
          reject()
        } else {
          logSuccess(`${project.name} builded successfully!`)
          console.log(stats.toString({
            all: false,
            colors: true,
            version: true,
            timings: true,
            builtAt: true,
            assets: true,
            children: true,
            warnings: true
          }))
          resolve()
        }
      })
    })
  }
}

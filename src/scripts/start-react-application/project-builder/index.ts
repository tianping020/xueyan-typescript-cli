import Webpack, { Configuration, Compiler } from 'webpack'
import ReactApplicationProject from '../../../projects/react-application-project'
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
    this.project = project
    this.config = {}
    this.config.mode = 'development'
    this.config.devtool = 'cheap-module-eval-source-map'
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
}

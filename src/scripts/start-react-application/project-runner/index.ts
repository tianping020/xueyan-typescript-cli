import ProjectBuilder from '../project-builder'
import WebpackDevServer, { Configuration } from 'webpack-dev-server'
import { withPath } from '../../../utils/path'
import { logSuccess, logInfo } from '../../../utils/print'

/**
 * 项目编译器
 */
export default class ProjectRunner {
  /**
   * project builder 实例
   */
  readonly builder: ProjectBuilder

  /**
   * webpack dev 服务器的配置项
   */
  readonly config: Configuration

  /**
   * webpack dev 服务器
   */
  readonly server: WebpackDevServer

  /**
   * 构造器
   */
  constructor({
    builder
  }: {
    builder: ProjectBuilder
  }) {
    const project = builder.project
    this.builder = builder
    this.config = {}
    this.config.hot = true
    this.config.compress = true
    this.config.stats = 'errors-warnings'
    this.config.contentBase = withPath(project.path, 'public')
    this.config.historyApiFallback = true
    this.config.open = true
    this.config.proxy = project.startProxies
    this.server = new WebpackDevServer(builder.compiler, this.config)
  }

  /**
   * 开启服务
   */
  open(): Promise<void> {
    return new Promise<void>(resolve => {
      const project = this.builder.project
      this.server.listen(project.startPort, () => {
        logSuccess(`${project.name} listening on http://127.0.0.1:${project.startPort}!\n`)
        resolve()
      })
    })
  }

  /**
   * 关闭服务
   */
  close(): Promise<void> {
    const project = this.builder.project
    return new Promise<void>(resolve => {
      this.server.close(() => {
        logInfo(`${project.name} server will closed on ${project.servePort}!`)
        resolve()
      })
    })
  }
}

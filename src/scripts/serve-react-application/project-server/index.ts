import express, { Express } from 'express'
import HttpProxyMiddleware from 'http-proxy-middleware'
import CompressionMiddleware from 'compression'
import HistoryApiMiddleware from 'connect-history-api-fallback'
import { withPath } from '../../../utils/path'
import { logSuccess, logInfoAndExit } from '../../../utils/print'
import ReactApplicationProject from '../../../projects/react-application-project'

/**
 * 项目服务器
 */
export default class ProjectRunner {
  /**
   * 项目信息
   */
  readonly project: ReactApplicationProject

  /**
   * webpack dev 服务器
   */
  readonly server: Express

  /**
   * 构造器
   */
  constructor({
    project
  }: {
    project: ReactApplicationProject
  }) {
    this.project = project
    this.server = express()
    /**
     * 服务代理（优先进行接口代理）
     */
    const serveProxies = project.serveProxies
    if (serveProxies) {
      serveProxies.forEach(({ path, context, ...config }) => {
        if (path) {
          this.server.use(path, HttpProxyMiddleware(config))
        } else if (context) {
          this.server.use(HttpProxyMiddleware(context, config))
        } else {
          this.server.use(HttpProxyMiddleware(config))
        }
      })
    }
    /**
     * 开启压缩（使得开启了gzip的页面可以减少传输量）
     */
    this.server.use(CompressionMiddleware())
    /**
     * 静态配置
     */
    this.server.use(express.static(withPath(project.path, 'dist')))
    /**
     * 前端单页路由（当寻不到静态页面时）
     */
    this.server.use(HistoryApiMiddleware({
      index: withPath(project.path, 'dist', 'index.html')
    }))
  }

  /**
   * 开启服务
   */
  open(): Promise<void> {
    return new Promise<void>(resolve => {
      const project = this.project
      this.server.listen(project.servePort, () => {
        logSuccess(`${project.name} listening on http://127.0.0.1:${project.servePort}!\n`)
        resolve()
      })
    })
  }

  /**
   * 关闭服务
   */
  close() {
    const project = this.project
    logInfoAndExit(`${project.name} server will closed on ${project.servePort}!`)
  }
}

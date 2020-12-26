import Webpack, { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'

/**
 * 入口
 * @param configInfo 
 */
export default function getPluginsConfig(builder: ProjectBuilder): Configuration['plugins'] {
  const project = builder.project
  return [
    new Webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      minify: true,
      template: withPath(project.path, 'public/index.html'),
      templateParameters: project
    })
  ]
}

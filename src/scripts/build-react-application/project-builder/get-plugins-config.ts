import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'

/**
 * 入口
 * @param configInfo 
 */
export default function getPluginsConfig(builder: ProjectBuilder): Configuration['plugins'] {
  const project = builder.project
  return [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: withPath(project.path, 'public'),
          to: withPath(project.path, 'dist'),
          globOptions: {
            ignore: [
              'index.html'
            ]
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash:8].css',
      chunkFilename: 'styles/[name].[hash:8].chunk.css',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      minify: true,
      template: withPath(project.path, 'public/index.html'),
      templateParameters: project.package
    })
  ]
}

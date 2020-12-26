import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'
import { Configuration } from 'webpack'

/**
 * 入口
 * @param configInfo 
 */
export default function getOptimizationConfig(builder: ProjectBuilder): Configuration['optimization'] {
  return {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    }
  }
}

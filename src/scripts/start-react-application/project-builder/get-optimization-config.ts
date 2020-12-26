import ProjectBuilder from './index'
import { Configuration } from 'webpack'

/**
 * 入口
 * @param configInfo 
 */
export default function getOptimizationConfig(builder: ProjectBuilder): Configuration['optimization'] {
  return {
    noEmitOnErrors: true,
    occurrenceOrder: true,
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    }
  }
}

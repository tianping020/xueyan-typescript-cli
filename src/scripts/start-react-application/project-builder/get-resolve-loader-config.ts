import ProjectBuilder from './index'
import { Configuration } from 'webpack'
import { cmdNmPath } from '../../../utils/path'

/**
 * 入口
 * @param configInfo 
 */
export default function getResolveLoaderConfig(builder: ProjectBuilder): Configuration['resolveLoader'] {
  return {
    modules: [
      cmdNmPath()
    ]
  }
}

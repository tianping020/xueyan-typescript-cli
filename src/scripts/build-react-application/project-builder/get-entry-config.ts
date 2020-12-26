import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'
import { Configuration } from 'webpack'

/**
 * 入口
 * @param configInfo 
 */
export default function getEntryConfig(builder: ProjectBuilder): Configuration['entry'] {
  const project = builder.project
  return {
    index: withPath(project.path, 'src/index.tsx')
  }
}

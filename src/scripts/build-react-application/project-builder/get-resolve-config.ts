import { withPath } from '../../../utils/path'
import ProjectBuilder from './index'
import { Configuration } from 'webpack'
import { mapValues } from 'lodash'

/**
 * 入口
 * @param configInfo 
 */
export default function getResolveConfig(builder: ProjectBuilder): Configuration['resolve'] {
  const project = builder.project
  const resolve: Configuration['resolve'] = {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.json',
      '.mjs'
    ]
  }
  if (project.moduleAlias) {
    resolve.alias = mapValues(
      project.moduleAlias,
      value => withPath(project.path, value)
    )
  }
  return resolve
}

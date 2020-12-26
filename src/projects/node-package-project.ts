import RootProject, { RootProjectProps, RootProjectConfig } from './root-project'

export type NodePackageType = 'node-package'

export type NodePackageProps = RootProjectProps

/**
 * xueyan.config
 */
export interface NodePackageConfig extends RootProjectConfig<NodePackageType> {
  
}

export default class NodePackageProject extends RootProject<NodePackageType> {
  /**
   * 初始化
   */
  constructor(props: NodePackageProps) {
    super('node-package', props)
  }
}

import RootProject, { RootProjectProps, RootProjectConfig } from './root-project'

export type NodeApplicationType = 'node-application'

export type NodeApplicationProps = RootProjectProps

/**
 * xueyan.config
 */
export interface NodeApplicationConfig extends RootProjectConfig<NodeApplicationType> {
  
}

export default class NodeApplicationProject extends RootProject<NodeApplicationType> {
  /**
   * 初始化
   */
  constructor(props: NodeApplicationProps) {
    super('node-application', props)
  }
}

import RootProject, { RootProjectProps, RootProjectConfig } from './root-project'

export type ReactPackageType = 'react-package'

export type ReactPackageProps = RootProjectProps

/**
 * xueyan.config
 */
export interface ReactPackageConfig extends RootProjectConfig<ReactPackageType> {
  
}

export default class ReactPackageProject extends RootProject<ReactPackageType> {
  /**
   * 初始化
   */
  constructor(props: ReactPackageProps) {
    super('react-package', props)
  }
}

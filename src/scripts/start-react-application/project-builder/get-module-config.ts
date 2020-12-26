import getAssetsModuleRules from './get-assets-module-rules'
import getScriptModuleRules from './get-script-module-rules'
import getStyleModuleRules from './get-style-module-rules'
import ProjectBuilder from './index'
import { Configuration, RuleSetRule } from 'webpack'

/**
 * 模块
 * @param configInfo 
 */
export default function getModuleConfig(builder: ProjectBuilder): Configuration['module'] {
  return {
    rules: Array<RuleSetRule>().concat(
      getScriptModuleRules(builder),
      getStyleModuleRules(builder),
      getAssetsModuleRules(builder)
    ).filter(Boolean)
  }
}

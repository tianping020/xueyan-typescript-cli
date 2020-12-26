import { RuleSetRule } from 'webpack'
import ProjectBuilder from './index'

function getHtmlRule(): RuleSetRule {
  return {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader'
      }
    ]
  }
}

export default function getScriptModuleRules(builder: ProjectBuilder): RuleSetRule[] {
  return [
    getHtmlRule()
  ]
}
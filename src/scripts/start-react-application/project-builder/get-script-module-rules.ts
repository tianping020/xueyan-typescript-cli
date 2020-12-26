import { RuleSetRule, RuleSetCondition } from 'webpack'
import ProjectBuilder from './index'
import { cmdNmPath } from '../../../utils/path'

function getBableRule(builder: ProjectBuilder): RuleSetRule {
  const project = builder.project
  const { babelParseIncludes, babelParseExcludes } = project
  let exclude: RuleSetCondition[] = [/node_modules/]
  if (babelParseExcludes) {
    exclude = exclude.concat(babelParseExcludes)
  }
  return {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: babelParseIncludes,
    exclude,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
          babelrc: false,
          configFile: false,
          presets: [
            cmdNmPath('@babel/preset-env'),
            cmdNmPath('@babel/preset-react'),
            cmdNmPath('@babel/preset-typescript'),
          ],
          plugins: [
            cmdNmPath('@babel/plugin-proposal-class-properties'),
          ]
        }
      }
    ]
  }
}

function getJsonRule(): RuleSetRule {
  return {
    test: /\.json$/,
    type: 'javascript/auto',
    use: [
      {
        loader: 'json-loader'
      }
    ]
  }
}

export default function getScriptModuleRules(builder: ProjectBuilder): RuleSetRule[] {
  return [
    getBableRule(builder),
    getJsonRule()
  ]
}
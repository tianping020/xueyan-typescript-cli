import { RuleSetRule, RuleSetLoader } from 'webpack'
import ProjectBuilder from './index'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import PostcssNormalize from 'postcss-normalize'

function getPostCssLoader(): RuleSetLoader {
  return {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      postcssOptions: {
        plugins: [
          Autoprefixer,
          PostcssImport(),
          PostcssPresetEnv(),
          PostcssNormalize()
        ]
      }
    }
  }
}

function getCssRule(): RuleSetRule {
  return {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 1
        }
      },
      getPostCssLoader()
    ]
  }
}

function getCssModuleRule(): RuleSetRule {
  return {
    test: /\.module\.css$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
          importLoaders: 1
        }
      },
      getPostCssLoader()
    ]
  }
}

function getSassRule(): RuleSetRule {
  return {
    test: /\.scss$/,
    exclude: /\.module\.(scss|sass)$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          importLoaders: 2
        }
      },
      getPostCssLoader(),
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
}

function getSassModuleRule(): RuleSetRule {
  return {
    test: /\.module\.(scss|sass)$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: true,
          importLoaders: 2
        }
      },
      getPostCssLoader(),
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
}

export default function getStyleModuleRules(builder: ProjectBuilder): RuleSetRule[] {
  return [
    getCssRule(),
    getCssModuleRule(),
    getSassRule(),
    getSassModuleRule()
  ]
}

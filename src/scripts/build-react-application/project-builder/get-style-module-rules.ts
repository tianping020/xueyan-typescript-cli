import { RuleSetRule, RuleSetLoader } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ProjectBuilder from './index'
import PostcssImport from 'postcss-import'
import PostcssPresetEnv from 'postcss-preset-env'
import Autoprefixer from 'autoprefixer'
import PostcssNormalize from 'postcss-normalize'
import Cssnano from 'cssnano'

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
          PostcssNormalize(),
          Cssnano()
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
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
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
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
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
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2
        }
      },
      getPostCssLoader(),
      {
        loader: 'sass-loader'
      }
    ]
  }
}

function getSassModuleRule(): RuleSetRule {
  return {
    test: /\.module\.(scss|sass)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 2
        }
      },
      getPostCssLoader(),
      {
        loader: 'sass-loader'
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

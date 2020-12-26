import ora from 'ora'
import del from 'del'
import { src, dest, watch } from 'gulp'
import filter from 'gulp-filter'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import NodeApplicationProject from '../../../projects/node-application-project'
import { cmdNmPath } from '../../../utils/path'
import { Options as BabelPresetEnvOpts } from '@babel/preset-env'

const scriptFilePattern = /\.(js|mjs|ts)$/

const defineFilePattern = /\.d\.ts$/

const testFilePattern = /\.test\.(js|mjs|ts)$/

/**
 * 项目编译器
 */
export default class ProjectBuilder {
  /**
   * 项目信息
   */
  readonly project: NodeApplicationProject

  /**
   * 构造器
   */
  constructor({
    project
  }: {
    project: NodeApplicationProject
  }) {
    this.project = project
  }

  /**
   * 构建
   * @param isWatch 是否启用监视
   */
  async build(isWatch?: boolean): Promise<void> {
    await del(this.project.withPath('dist'))
    if (isWatch) {
      watch('src/**/*', { cwd: this.project.path }, () => {
        return this.compile()
      })
    }
    return this.compile()
  }

  /**
   * 编译
   */
  private compile(): Promise<void> {
    const taskLine = async () => {
      await this.copyAssets()
      await this.compileLibModule()
    }
    const buildOra = ora(`${this.project.name} is building`)
    return new Promise<void>((resolve, reject) => {
      buildOra.start()
      taskLine().then(() => {
        buildOra.succeed(`${this.project.name} builded successfully!`)
        resolve()
      }).catch(err => {
        buildOra.fail(`${this.project.name} build failed!`)
        console.error(err)
        reject()
      })
    })
  }

  /**
   * 复制其他非脚本文件至dist目录
   * @param done 
   */
  private copyAssets(): Promise<void> {
    return new Promise((resolve, reject) => {
      src(['src/**/*', 'src/**/.*'], { cwd: this.project.path })
        .pipe(filter(file => !scriptFilePattern.test(file.path)))
        .pipe(dest('dist'))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 将脚本的转成node语法至dist目录
   * @param done 
   */
  private compileLibModule() {
    return new Promise((resolve, reject) => {
      if (!this.project.hasBabelRuntimeDep()) {
        reject('please install @babel/runtime dependence')
      }
      src('src/**/*', { cwd: this.project.path })
        .pipe(filter(file => {
          return scriptFilePattern.test(file.path)
            && !defineFilePattern.test(file.path)
            && !testFilePattern.test(file.path)
        }))
        .pipe(
          babel({
            presets: [
              [cmdNmPath('@babel/preset-env'), {
                modules: 'cjs'
              } as BabelPresetEnvOpts] as any,
              cmdNmPath('@babel/preset-typescript'),
            ],
            plugins: [
              cmdNmPath('@babel/plugin-transform-runtime'),
              cmdNmPath('@babel/plugin-proposal-class-properties'),
            ]
          })
          .on('error', reject)
        )
        .pipe(uglify({ mangle: { toplevel: true }}))
        .pipe(dest('dist'))
        .on('error', reject)
        .on('end', resolve)
    })
  }
}

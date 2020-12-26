import ora from 'ora'
import del from 'del'
import { src, dest, watch } from 'gulp'
import ts from 'gulp-typescript'
import filter from 'gulp-filter'
import babel from 'gulp-babel'
import NodePackageProject from '../../../projects/node-package-project'
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
  readonly project: NodePackageProject

  /**
   * 构造器
   */
  constructor({
    project
  }: {
    project: NodePackageProject
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
      await this.compileTypes()
      await this.compileEsModule()
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
        .pipe(dest('dist/es'))
        .pipe(dest('dist/lib'))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 生成脚本的类型定义至dist目录
   * @param done 
   */
  private async compileTypes(): Promise<void> {
    await new Promise((resolve, reject) => {
      src('src/**/*', { cwd: this.project.path })
        .pipe(filter(file => defineFilePattern.test(file.path)))
        .pipe(dest('dist/types'))
        .on('error', reject)
        .on('end', resolve)
    })
    await new Promise((resolve, reject) => {
      const tsSetting: ts.Settings = {
        declaration: true,
        removeComments: false,
      }
      const tsProject = ts.createProject(
        this.project.withPath('tsconfig.json'),
        tsSetting
      )
      tsProject.src()
        .pipe(tsProject().on('error', reject))
        .dts.pipe(dest(this.project.withPath('dist/types')))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 将脚本的转成es语法至dist目录
   * @param done 
   */
  private compileEsModule() {
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
                modules: false
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
        .pipe(dest('dist/es'))
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
        .pipe(dest('dist/lib'))
        .on('error', reject)
        .on('end', resolve)
    })
  }
}

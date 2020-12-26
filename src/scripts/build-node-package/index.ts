import ProjectBuilder from './project-builder'
import NodePackageProject from '../../projects/node-package-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: NodePackageProject) {
  const program = project.program
  const builder = new ProjectBuilder({ project })
  await builder.build(program.watch)
  return builder
}

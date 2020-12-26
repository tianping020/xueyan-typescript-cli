import ProjectBuilder from './project-builder'
import ReactPackageProject from '../../projects/react-package-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactPackageProject) {
  const program = project.program
  const builder = new ProjectBuilder({ project })
  await builder.build(program.watch)
  return builder
}

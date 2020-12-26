import ProjectBuilder from './project-builder'
import NodeApplicationProject from '../../projects/node-application-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: NodeApplicationProject) {
  const program = project.program
  const builder = new ProjectBuilder({ project })
  await builder.build(program.watch)
  return builder
}

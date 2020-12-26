import ProjectBuilder from './project-builder'
import ReactApplicationProject from '../../projects/react-application-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactApplicationProject) {
  const builder = new ProjectBuilder({ project })
  await builder.build()
  return builder
}

import ProjectBuilder from './project-builder'
import ProjectRunner from './project-runner'
import ReactApplicationProject from '../../projects/react-application-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactApplicationProject) {
  const builder = new ProjectBuilder({ project })
  const runner = new ProjectRunner({ builder })
  await runner.open()
  return runner
}

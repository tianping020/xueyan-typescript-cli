import ProjectServer from './project-server'
import ReactApplicationProject from '../../projects/react-application-project'

/**
 * 主程序
 * @param projectInfo 
 */
export default async function main(project: ReactApplicationProject) {
  const server = new ProjectServer({ project })
  await server.open()
  return server
}

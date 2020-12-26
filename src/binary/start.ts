#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from '../utils/print'
import { readPackageInfoSyncByPath, readJSONSyncByValue } from '../utils/read'
import { cwdPath } from '../utils/path'

import ReactApplicationProject from '../projects/react-application-project'
// import ReactPackageProject from '../projects/react-package-project'
// import NodePackageProject from '../projects/node-package-project'
// import NodeApplicationProject from '../projects/node-application-project'

import startReactApplication from '../scripts/start-react-application'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('develop or debug project on browser')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path: string) {
  const projectPath = cwdPath(path)
  const packageInfo = readPackageInfoSyncByPath(projectPath)
  const config = readJSONSyncByValue(packageInfo.xueyan, projectPath)
  if (config.type === 'react-application') {
    await startReactApplication(new ReactApplicationProject({
      config,
      program,
      path: projectPath,
      package: packageInfo,
    }))
  } else {
    logErrorAndExit('Please Indicates the type of project at package.json')
  }
}

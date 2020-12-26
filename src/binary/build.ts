#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from '../utils/print'
import { readPackageInfoSyncByPath, readJSONSyncByValue } from '../utils/read'
import { cwdPath } from '../utils/path'

import ReactApplicationProject from '../projects/react-application-project'
import ReactPackageProject from '../projects/react-package-project'
import NodePackageProject from '../projects/node-package-project'
import NodeApplicationProject from '../projects/node-application-project'

import buildReactApplication from '../scripts/build-react-application'
import buildReactPackage from '../scripts/build-react-package'
import buildNodePackage from '../scripts/build-node-package'
import buildNodeApplication from '../scripts/build-node-application'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('build project to production line')
  .arguments('[path]')
  .option('-w, --watch', 'watch file change')
  .action(action)
  .parse(process.argv)

async function action(path: string) {
  const projectPath = cwdPath(path)
  const packageInfo = readPackageInfoSyncByPath(projectPath)
  const config = readJSONSyncByValue(packageInfo.xueyan, projectPath)
  if (config.type === 'react-application') {
    await buildReactApplication(new ReactApplicationProject({
      config,
      program,
      path: projectPath,
      package: packageInfo,
    }))
  } else if (config.type === 'react-package') {
    await buildReactPackage(new ReactPackageProject({
      config,
      program,
      path: projectPath,
      package: packageInfo,
    }))
  } else if (config.type === 'node-package') {
    await buildNodePackage(new NodePackageProject({
      config,
      program,
      path: projectPath,
      package: packageInfo,
    }))
  } else if (config.type === 'node-application') {
    await buildNodeApplication(new NodeApplicationProject({
      config,
      program,
      path: projectPath,
      package: packageInfo,
    }))
  } else {
    logErrorAndExit('Please Indicates the type of project at package.json')
  }
}

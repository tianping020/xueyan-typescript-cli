#!/usr/bin/env node

import { Command } from 'commander'
import { prompt } from 'enquirer'
import validator from 'validator'
import { logErrorAndExit } from '../utils/print'
import { cwdPath } from '../utils/path'
import { readGitConfigSync } from '../utils/read'
import { RootProjectProps } from '../projects/root-project'

import ReactApplicationProject from '../projects/react-application-project'
import ReactPackageProject from '../projects/react-package-project'
import NodePackageProject from '../projects/node-package-project'
import NodeApplicationProject from '../projects/node-application-project'

import createReactApplication from '../scripts/create-react-application'
import createReactPackage from '../scripts/create-react-package'
import createNodePackage from '../scripts/create-node-package'
import createNodeApplication from '../scripts/create-node-application'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

interface Answers {
  type: string,
  name: string,
  author: string,
  email: string,
  path: string
}

async function action(path: string) {
  const git = readGitConfigSync()
  const answers = await prompt<Answers>([
    {
      type: 'select',
      name: 'type',
      message: 'project type',
      required: true,
      choices: [
        {
          name: 'react-application',
          message: 'react application'
        },
        {
          name: 'react-package',
          message: 'react package'
        },
        {
          name: 'node-package',
          message: 'node package'
        },
        {
          name: 'node-application',
          message: 'node application'
        }
      ]
    },
    {
      type: 'input',
      name: 'name',
      message: 'package name',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str)
    },
    {
      type: 'input',
      name: 'path',
      message: 'project path',
      required: true,
      initial: (data: any) => {
        const answers = data.state.answers
        const packageName = answers.name || ''
        return cwdPath(path, packageName.replace('/', '__'))
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'package author name',
      required: true,
      initial: git.user.name
    },
    {
      type: 'input',
      name: 'email',
      message: 'package author email',
      required: true,
      initial: git.user.email,
      validate: validator.isEmail
    }
  ])
  const props: RootProjectProps = {
    program,
    config: {},
    path: answers.path,
    package: {
      name: answers.name,
      version: '1.0.0',
      author: `${answers.author} <${answers.email}>`
    }
  }
  if (answers.type === 'react-application') {
    await createReactApplication(new ReactApplicationProject(props))
  } else if (answers.type === 'react-package') {
    await createReactPackage(new ReactPackageProject(props))
  } else if (answers.type === 'node-package') {
    await createNodePackage(new NodePackageProject(props))
  } else if (answers.type === 'node-application') {
    await createNodeApplication(new NodeApplicationProject(props))
  } else {
    logErrorAndExit('Please Indicates the type of project at package.json')
  }
}

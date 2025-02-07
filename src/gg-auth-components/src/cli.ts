#!/usr/bin/env node

import { program } from 'commander'
import fs from 'fs'
import path from 'path'

program
  .version('0.1.0')
  .description('CLI for gg-auth-components')

program
  .command('init <project-name>')
  .description('Initialize a new project with gg-auth-components')
  .action((projectName: string) => {
    const projectPath = path.join(process.cwd(), projectName)
    
    if (fs.existsSync(projectPath)) {
      console.error(`Error: Directory ${projectName} already exists.`)
      process.exit(1)
    }

    fs.mkdirSync(projectPath)

    const packageJson = {
      name: projectName,
      version: '0.1.0',
      dependencies: {
        'gg-auth-components': '^0.1.0',
        'react': '^17.0.2',
        'react-dom': '^17.0.2'
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject'
      }
    }

    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )

    console.log(`Project ${projectName} initialized with gg-auth-components.`)
    console.log('Run the following commands to get started:')
    console.log(`cd ${projectName}`)
    console.log('npm install')
    console.log('npm start')
  })

program.parse(process.argv)
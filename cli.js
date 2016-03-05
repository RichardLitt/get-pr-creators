#!/usr/bin/env node
'use strict'

const meow = require('meow')
const getGithubPRCreators = require('./')
const Promise = require('bluebird')
const gitconfig = require('gitconfiglocal')
const pify = require('pify')
const ghauth = Promise.promisify(require('ghauth'))
const authOptions = {
  configName: 'ghPRCreators',
  note: 'Get GitHub PR creators',
  userAgent: 'ghPRCreators',
  scope: ['repo']
}

const cli = meow([`
  Usage
    $ get-github-pr-creators [input]

  Options
    -r, --repo  Only for a specific repo. [Default: false]
    -s, --since Only since a specific time. [Default: false]
    -u, --until Only to a specific time. [Default: false]

  Examples
    $ get-github-pr-creators
    RichardLitt
    $ get-github-pr-creators RichardLitt --repo=get-github-pr-creators --since=2016-01-15T00:01:01Z --until=2016-01-20T00:01:05Z
    RichardLitt
`, {
  alias: {
    r: 'repo',
    s: 'since',
    u: 'until'
  }
}])

Promise.try(() => {
  return pify(gitconfig)(process.cwd())
}).then(config => {
  if (config && config.remote && config.remote.origin && config.remote.origin.url) {
    return config.remote.origin.url.split(':')[1].split('.git')[0].split('/')
  }
}).then((res) => {
  if (res && cli.input.length === 0) {
    cli.input[0] = res[0]
    cli.flags['repo'] = res[1]
  }
  return ghauth(authOptions)
}).then((authData) => {
  return getGithubPRCreators(cli.input[0], cli.flags, authData.token)
}).map(function (response) {
  console.log(response)
})

'use strict'

const Octokat = require('octokat')
var octo
const Promise = require('bluebird')
const moment = require('moment')
const _ = require('lodash')
const depaginate = require('depaginate')
const getGithubUser = require('get-github-user')
const sortAlphabetic = require('sort-alphabetic')

module.exports = function (org, flags, token) {
  octo = new Octokat({
    token: token || process.env.GITHUB_OGN_TOKEN
  })

  function getAllRepos (org, flags) {
    return Promise.try(function () {
      if (org.type === 'Organization') {
        return octo.orgs(org.login).repos.fetch()
      } else {
        return octo.users(org.login).repos.fetch()
      }
    }).map(function (repo) {
      return depaginate(function (opts) {
        return octo.repos(opts.org, opts.repoName).pulls.fetch({
          // Weird issue with since being mandatory.
          since: (opts.since) ? opts.since : '2000-01-01T00:01:01Z',
          page: opts.page,
          state: 'all'
        })
      }, {
        org: org.login,
        repoName: repo.name,
        page: 1,
        since: flags.since
      })
    }).then(_.flatten.bind(_))
  }

  function getRepo (org, flags) {
    return Promise.resolve().then(function () {
      return depaginate(function (opts) {
        return octo.repos(opts.org, opts.repoName).pulls.fetch({
          since: (flags.since) ? flags.since : '2000-01-01T00:01:01Z',
          page: opts.page,
          state: 'all' // TODO Make this a flag
        })
      }, {
        org: org.login,
        repoName: flags.repo,
        page: 1,
        since: flags.since
      })
    })
  }

  if (flags.since && !moment(flags.since).isValid()) {
    throw new Error('Since flag is an invalid date.')
  }

  if (flags.until && !moment(flags.until).isValid()) {
    throw new Error('Until flag is an invalid date.')
  }

  return Promise.resolve().then(() => {
    return getGithubUser(org)
  }).then((user) => {
    if (user.length === 0) {
      throw new Error(`${org} is not a valid GitHub user`)
    } else {
      return user
    }
  }).then((user) => {
    if (flags.repo) {
      return getRepo(user[0], flags)
    } else {
      return getAllRepos(user[0], flags)
    }
  })
  .filter((response) => {
    if (flags.since && flags.until && moment(response.updatedAt).isBetween(flags.since, flags.until)) {
      return response
    } else if (flags.since && !flags.until && moment(response.updatedAt).isAfter(flags.since)) {
      return response
    } else if (!flags.since && flags.until && moment(response.updatedAt).isBefore(flags.until)) {
      return response
    } else if (!flags.since && !flags.until) {
      return response
    }
  })
  .map((response) => {
    // console.log(response.user.login)
    return response.user.login
  })
  .then((response) => sortAlphabetic(_.uniq(_.without(response, undefined))))
  .catch((err) => {
    console.log('err', err)
  })
}

# get-github-pr-creators [![Build Status](https://travis-ci.org/RichardLitt/get-github-pr-creators.svg?branch=master)](https://travis-ci.org/RichardLitt/get-github-pr-creators)

> Get a list of GitHub PR creators from an organization or repo


## Install

```
$ npm install --save get-github-pr-creators
```


## Usage

```js
const getGithubPRCreators = require('get-github-pr-creators');

getGithubPRCreators('RichardLitt', {
    since: '2016-01-15T00:20:24Z',
    until: '2016-01-20T00:20:24Z',
    repo: 'get-github-pr-creators'
  });
//=> 'RichardLitt'
```


## API

### getGithubPRCreators(input, [options])

#### org

Type: `string`

The organization or user to scour for pull requests. If not set, it will grab the
user and repository of the current git directory, and use that user and that
repository as options.

#### options.since

Type: `string`

The ISO date from which to get PRS that have been made.

#### options.until

Type: `string`

The ISO date to which to get PRs that have been made.

#### options.repo

Type: `string`

A repo to search for PRs from.


## CLI

```
$ npm install --global get-github-pr-creators
```

```
$ get-github-pr-creators --help

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

```


## License

MIT © [Richard Littauer](http://burntfen.com)

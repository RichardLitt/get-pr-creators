import test from 'ava'
import fn from './'

test('with since from this repo', t => {
  return fn('RichardLitt', {
    since: '2016-01-17T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, [])
  })
})

test('with bad since from this repo', t => {
  return fn('RichardLitt', {
    since: '2016-01-19T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, [])
  })
})

test('with until from this repo', t => {
  return fn('RichardLitt', {
    until: '2016-01-19T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, ['RichardLitt'])
  })
})

test('with bad until from this repo', t => {
  return fn('RichardLitt', {
    until: '2016-01-10T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, [])
  })
})

test('with between from this repo', t => {
  return fn('RichardLitt', {
    since: '2016-01-10T04:29:11.301Z',
    until: '2016-01-20T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, ['RichardLitt'])
  })
})

test('with bad between from this repo', t => {
  return fn('RichardLitt', {
    since: '2016-01-19T04:29:11.301Z',
    until: '2016-01-20T04:29:11.301Z',
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, [])
  })
})

test('without since', t => {
  return fn('RichardLitt', {
    repo: 'get-github-pr-creators'
  }).then(result => {
    t.same(result, ['RichardLitt'])
  })
})

test('from an organization repo', t => {
  return fn('ipfs', {
    repo: 'community'
  }).then(result => {
    t.pass()
    t.true(result.indexOf('RichardLitt') !== -1, 'RichardLitt is in issue creators')
  })
})

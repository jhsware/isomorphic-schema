

const expect = require('expect.js')

describe('CJS-build', function() {
  it('can be imported', function() {
    const theLib = require('../dist/cjs')
    expect(theLib).not.to.be(undefined)           
  })

  it('import has content', function() {
    const { Schema } = require('../dist/cjs')
    expect(Schema).not.to.be(undefined)           
  })
})

describe('UMD-build', function() {
  it('can be imported', function() {
    const theLib = require('../dist/umd')
    expect(theLib).not.to.be(undefined)           
  })

  it('import has content', function() {
    const { Schema } = require('../dist/umd')
    expect(Schema).not.to.be(undefined)           
  })
})
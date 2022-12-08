import { describe, expect, it } from "@jest/globals";

describe('CJS-build', function() {
  it('can be imported', async function() {
    const theLib = require('../dist/cjs')
    expect(theLib).not.toBe(undefined)           
  })

  it('import has content', async function() {
    const { Schema } = require('../dist/cjs')
    expect(Schema).not.toBe(undefined)           
  })
})

describe('UMD-build', function() {
  it('can be imported', async function() {
    const theLib = require('../dist/umd')
    expect(theLib).not.toBe(undefined)           
  })

  it('import has content', async function() {
    const { Schema } = require('../dist/umd')
    expect(Schema).not.toBe(undefined)           
  })
})
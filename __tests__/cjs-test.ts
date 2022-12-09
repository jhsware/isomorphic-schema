import { describe, expect, it } from "@jest/globals";

describe('CJS-build', function() {
  it('can be imported', async function() {
    const theLib = require('../dist/index.cjs.js')
    expect(theLib).not.toBe(undefined)
  })

  it('import has content', async function() {
    const { Schema } = require('../dist/index.cjs.js')
    expect(Schema).not.toBe(undefined)           
  })
})

// describe('ESM-build', function() {
//   it('can be imported', async function() {
//     const theLib = await import('../dist/index.module.js');
//     expect(theLib).not.toBe(undefined)           
//   })

//   it('import has content', async function() {
//     const { Schema } = await import('../dist/index.module.js');
//     expect(Schema).not.toBe(undefined)           
//   })
// })
var assert = require('assert');
var expect = require('expect.js');

var i18n = require('../lib/utils').i18n;
var clone = require('../lib/utils').clone;

describe('Utils', function() {
    describe('i18n', function() {
        it('returns the first parameter', function() {        
            var result = i18n('the_key', 'The Help Text');
        
            expect(result).to.equal('the_key');            
        })
    })

    describe('clone', function() {
        it('creates a deep clone of an object', function() {
            var obj = {
                obj: {
                    str: 'hello'
                },
                arr: [1,2, { str: 'test' }],
                str: 'world',
            }
            var objClone = clone(obj);
        
            // Check that we have deep cloned
            expect(objClone).not.to.be(obj);
            expect(objClone.obj).not.to.be(obj.obj);
            expect(objClone.arr).not.to.be(obj.arr);
            expect(objClone.arr[2]).not.to.be(obj.arr[2]);
            
            // Check the values are equal
            expect(objClone.obj.str).to.equal(obj.obj.str);
            expect(objClone.arr[2].str).to.equal(obj.arr[2].str);
            expect(objClone.arr[0]).to.equal(obj.arr[0]);
        })
    })
})
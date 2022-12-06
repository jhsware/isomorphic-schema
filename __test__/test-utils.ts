
import { describe, expect, it } from "@jest/globals";
import IntegerField from '../src/field_validators/IntegerField'
import BaseField from '../src/field_validators/BaseField'
var i18n = require('../src/utils').i18n;
var clone = require('../src/utils').clone;
var renderString = require('../src/utils').renderString;

describe('Utils', function() {
    describe('i18n', function() {
        it('returns the first parameter', function() {        
            var result = i18n('the_key', 'The Help Text');
        
            expect(result).toEqual('the_key');            
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
            expect(objClone).not.toBe(obj);
            expect(objClone.obj).not.toBe(obj.obj);
            expect(objClone.arr).not.toBe(obj.arr);
            expect(objClone.arr[2]).not.toBe(obj.arr[2]);
            
            // Check the values are equal
            expect(objClone).toStrictEqual(obj);
        })
    })

    describe('renderString', function() {
        it('substitute placeholders with field definition values', function() {
            var integerField = new IntegerField({required: true, min: 1});
            var result = renderString('Min ${minValue}', integerField);
            expect(result).toEqual('Min 1');
        })

        it('is ok with not getting any placeholders', function() {
            var baseField = new BaseField({required: true});
            var result = renderString('Required', baseField);
            expect(result).toEqual('Required');
        })

        it('leaves placeholders that don\'t have corresponding values', function() {
            var integerField = new IntegerField({required: true, min: 1});
            var result = renderString('Min ${notFound}', integerField);
            expect(result).toEqual('Min ${notFound}');
        })
    })
})
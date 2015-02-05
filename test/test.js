'use strict';

var GMObject = require('../lib/mapper');
var assert = require('assert');

var testObject = {
    testString: 'value',
    testNumber: 42
};

describe('Explicit mode', function () {

    it('Should compute property from other properties', function () {
        var gmo = new GMObject();

        gmo.add('computed')
            .use('testString', 'testNumber')
            .handler(function (testString, testNumber) {
                return testString + testNumber;
            });

        var fixture = gmo.parse(testObject);
        var expected = {computed: 'value42'};

        assert.deepEqual(fixture, expected);
    });

    it('Should create new properties', function () {
        var gmo = new GMObject();

        gmo.add('testBoolean')
            .handler(function () {
                return false;
            });

        gmo.add('testValue')
            .handler(function () {
                return 'someValue'
            });

        var fixture = gmo.parse(testObject);
        var expected = {testBoolean: false, testValue: 'someValue'};

        assert.deepEqual(fixture, expected);
    });

    it('Should rename properties', function () {
        var gmo = new GMObject();

        gmo.add('renamedString')
            .use('testString')
            .handler(function(testString) {
                return testString;
            });

        var fixture = gmo.parse(testObject);
        var expected = {renamedString: 'value'};

        assert.deepEqual(fixture, expected);
    });

    it('Should copy properties from source object', function () {
        var gmo = new GMObject();

        gmo.add('testString')
            .use('testString')
            .handler(function(testString) {
                return testString;
            });

        gmo.add('testNumber')
            .use('testNumber')
            .handler(function(testNumber) {
                return testNumber;
            });

        var fixture = gmo.parse(testObject);

        assert.deepEqual(fixture, testObject);
    });

});

describe('Magic mode', function () {

    it('Should rename properties', function () {
        var gmo = new GMObject();

        gmo.add('renamedString').use('testString');

        var fixture = gmo.parse(testObject);
        var expected = {renamedString: 'value'};

        assert.deepEqual(fixture, expected);
    });

    it('Should copy properties from source object', function () {
        var gmo = new GMObject();

        gmo.use('testString', 'testNumber');

        var fixture = gmo.parse(testObject);

        assert.deepEqual(fixture, testObject);
    });

});
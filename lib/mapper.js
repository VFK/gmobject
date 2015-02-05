'use strict';

var Rule = require('./rule');

var Mapper = function () {
    this.rules = [];
};

Mapper.prototype.add = function (name) {
    var rule = new Rule(name);
    this.rules.push(rule);

    return rule;
};

Mapper.prototype.use = function () {
    var names = Array.prototype.slice.call(arguments);

    names.forEach(function (name) {
        this.rules.push(new Rule(name));
    }.bind(this));
};

Mapper.prototype.parse = function (object) {
    var result = {};
    this.rules.forEach(function (rule) {
        result[rule.name] = rule.execute(object);
    });

    return result;
};

module.exports = Mapper;

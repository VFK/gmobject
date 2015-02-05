'use strict';

var Rule = function (name) {
    this.name = name;
    this.items = [];
    this._handler = null;
};

Rule.prototype.use = function () {
    this.items = Array.prototype.slice.call(arguments);

    return this;
};

Rule.prototype.handler = function (handler) {
    this._handler = handler;

    return this;
};

Rule.prototype.execute = function (obj) {
    var result = this.items.map(function (item) {
        return obj[item];
    });

    if (!this._handler) {
        this._handler = function () {
            if (result.length) {
                return result[0];
            }

            return obj[this.name];
        }.bind(this);
    }

    return this._handler.apply(null, result);
};

module.exports = Rule;

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lodash_1 = __importDefault(require("lodash"));
    function propose(initial, consensus) {
        var white = initial.white;
        var black = initial.black;
        // get a joined list of all terms with consensus so far
        if (consensus) {
            var consent_1 = lodash_1.default.concat(consensus.black, consensus.white);
            // filter valuations from the initial position where there is consensus yet
            white = lodash_1.default.filter(white, function (item) { return !lodash_1.default.find(consent_1, function (i) { return i.id == item.id; }); });
            black = lodash_1.default.filter(black, function (item) { return !lodash_1.default.find(consent_1, function (i) { return i.id == item.id; }); });
        }
        var terms = lodash_1.default.map(white, function (v1) {
            var v2 = lodash_1.default.find(black, function (v) { return v.id == v1.id; });
            return {
                id: v1.id,
                black: {
                    value: v2.value,
                    weight: v2.weight
                },
                white: {
                    value: v1.value,
                    weight: v1.weight
                }
            };
        });
        var critical = [];
        var results = {
            black: [],
            white: []
        };
        lodash_1.default.forEach(terms, function (term) {
            var w = term.white;
            var b = term.black;
            var result = {
                id: term.id,
                value: null
            };
            if (w.value == b.value) {
                result.value = w.value;
                results.black.push(result);
                results.white.push(result);
            }
            else if (w.weight > b.weight) {
                result.value = w.value;
                results.white.push(result);
            }
            else if (w.weight < b.weight) {
                result.value = b.value;
                results.black.push(result);
            }
            else {
                critical.push(term);
            }
        });
        // randomly resolve conflicts
        if (critical.length > 0) {
            var d = Math.round(critical.length / 2);
            // randomly pick half of critical items and give to white, rest to black
            var whiteWins = [];
            while (d > 0) {
                var i = Math.round(Math.random() * (critical.length - 1));
                whiteWins = whiteWins.concat(critical.splice(i, 1));
                d--;
            }
            critical.forEach(function (term) {
                results.black.push({
                    id: term.id,
                    value: term.black.value
                });
            });
            whiteWins.forEach(function (term) {
                results.white.push({
                    id: term.id,
                    value: term.white.value
                });
            });
        }
        return results;
    }
    exports.propose = propose;
    function bucketize(initial, proposal) {
        // todo: strip euqal positions
        var initialBlack = initial.black;
        var initialWhite = initial.white;
        var black = lodash_1.default
            .chain(proposal.black)
            .map(function (item) {
            var iB = lodash_1.default.find(initialBlack, function (b) { return b.id == item.id; });
            return lodash_1.default.merge(item, { weight: iB.weight });
        })
            .sortBy(function (item) { return -item.weight; })
            .value();
        var white = lodash_1.default
            .chain(proposal.white)
            .map(function (item) {
            var iB = lodash_1.default.find(initialWhite, function (b) { return b.id == item.id; });
            return lodash_1.default.merge(item, { weight: iB.weight });
        })
            .sortBy(function (item) { return -item.weight; })
            .value();
        var result = [];
        var bucket = {
            black: [],
            white: []
        };
        while (!lodash_1.default.isEmpty(white) || !lodash_1.default.isEmpty(black)) {
            if (lodash_1.default.isEmpty(white)) {
                bucket.black = lodash_1.default.chain(black).map(function (item) { return lodash_1.default.omit(item, ['weight']); }).value();
                black = [];
            }
            else if (lodash_1.default.isEmpty(black)) {
                bucket.white = lodash_1.default.chain(white).map(function (item) { return lodash_1.default.omit(item, ['weight']); }).value();
                white = [];
            }
            else {
                var ww = white[0].weight;
                var bw = black[0].weight;
                bucket.white.push(lodash_1.default.omit(white.shift(), ['weight']));
                bucket.black.push(lodash_1.default.omit(black.shift(), ['weight']));
                if (ww > bw) {
                    do {
                        if (lodash_1.default.isEmpty(black))
                            break;
                        var x = black.shift();
                        bucket.black.push(lodash_1.default.omit(x, ['weight']));
                        bw += x.weight;
                    } while (ww > bw);
                }
                else if (ww < bw) {
                    do {
                        if (lodash_1.default.isEmpty(white))
                            break;
                        var x = white.shift();
                        bucket.white.push(lodash_1.default.omit(x, ['weight']));
                        ww += x.weight;
                    } while (ww < bw);
                }
            }
            result.push(bucket);
            bucket = {
                black: [],
                white: []
            };
        }
        return result;
    }
    exports.bucketize = bucketize;
});

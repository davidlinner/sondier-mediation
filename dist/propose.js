"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
exports.__esModule = true;
var _ = __importStar(require("lodash"));
/**
 * Takes the positions of two parties black and white and returns two lists,
 * one with consents between the two parties and one with dissents. A consent is achieved if the two parties gave equals values to the same item.
 * A dissent means, the values are different. In case the values differ, the weight decides on the winning position. So the overall sum of weights
 * for both parties' items must be equal, otherwise the result will be unfair.
 *
 * @param {Position} initial - The initial positions of both parties black and white with weights.
 * @param {Proposal} consensus - An earlier achieved (partial) consensus on the initial positions to be respected when deriving a new proposal.
 * @returns
 * 'dissent' contains for both parties a list of items their position was defended for. Obviously the lists are mutually exclusive.
 * 'consent' contains for both parties a list of items they agree on. This means effectively each item in black is also found in white and vice versa.
 * An initially passed partial consensus is not included with the result.
 */
function propose(initial, consensus) {
    var white = initial.white;
    var black = initial.black;
    // get a joined list of all terms with consensus so far
    if (consensus) {
        var consent_1 = _.concat(consensus.black, consensus.white);
        // filter valuations from the initial position where there is consensus yet
        white = _.filter(white, function (item) { return !_.find(consent_1, function (i) { return i.id == item.id; }); });
        black = _.filter(black, function (item) { return !_.find(consent_1, function (i) { return i.id == item.id; }); });
    }
    var terms = _.map(white, function (v1) {
        var v2 = _.find(black, function (v) { return v.id == v1.id; });
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
    var dissent = {
        black: [],
        white: []
    };
    var consent = {
        black: [],
        white: []
    };
    _.forEach(terms, function (term) {
        var w = term.white;
        var b = term.black;
        var result = {
            id: term.id,
            value: null
        };
        if (w.value == b.value) {
            result.value = w.value;
            consent.black.push(result);
            consent.white.push(result);
        }
        else if (w.weight > b.weight) {
            result.value = w.value;
            dissent.white.push(result);
        }
        else if (w.weight < b.weight) {
            result.value = b.value;
            dissent.black.push(result);
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
            dissent.black.push({
                id: term.id,
                value: term.black.value
            });
        });
        whiteWins.forEach(function (term) {
            dissent.white.push({
                id: term.id,
                value: term.white.value
            });
        });
    }
    return { dissent: dissent, consent: consent };
}
exports.propose = propose;

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
 * Groups the full proposal for the resolution of dissents created by 'propose' into smaller buckets,
 * containing only one or few preferences for both sites. Uses the weights originally given by the parties black and white
 * to balance importance of positions.
 *
 * @param {Position} initial  The initial positions of both parties black and white with weights.
 * @param {Proposal} proposal Two mutual exclusive lists of positions respective party is supposed to defend.
 * @return
 * A splitted version of grouped the passed 'proposal' balanced by weights.
 *
 *
 */
function bucketize(initial, proposal) {
    var initialBlack = initial.black;
    var initialWhite = initial.white;
    var black = _
        .chain(proposal.black)
        .map(function (item) {
        var iB = _.find(initialBlack, function (b) { return b.id == item.id; });
        return _.merge(item, { weight: iB.weight });
    })
        .sortBy(function (item) { return -item.weight; })
        .value();
    var white = _
        .chain(proposal.white)
        .map(function (item) {
        var iB = _.find(initialWhite, function (b) { return b.id == item.id; });
        return _.merge(item, { weight: iB.weight });
    })
        .sortBy(function (item) { return -item.weight; })
        .value();
    var result = [];
    var bucket = {
        black: [],
        white: []
    };
    while (!_.isEmpty(white) || !_.isEmpty(black)) {
        if (_.isEmpty(white)) {
            bucket.black = _.chain(black).map(function (item) { return _.omit(item, ['weight']); }).value();
            black = [];
        }
        else if (_.isEmpty(black)) {
            bucket.white = _.chain(white).map(function (item) { return _.omit(item, ['weight']); }).value();
            white = [];
        }
        else {
            var ww = white[0].weight;
            var bw = black[0].weight;
            bucket.white.push(_.omit(white.shift(), ['weight']));
            bucket.black.push(_.omit(black.shift(), ['weight']));
            if (ww > bw) {
                do {
                    if (_.isEmpty(black))
                        break;
                    var x = black.shift();
                    bucket.black.push(_.omit(x, ['weight']));
                    bw += x.weight;
                } while (ww > bw);
            }
            else if (ww < bw) {
                do {
                    if (_.isEmpty(white))
                        break;
                    var x = white.shift();
                    bucket.white.push(_.omit(x, ['weight']));
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

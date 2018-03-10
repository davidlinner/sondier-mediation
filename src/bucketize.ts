import {Position} from "./model/Position";
import {Proposal} from "./model/Proposal";

import * as _ from 'lodash';

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
export function bucketize(initial: Position, proposal: Proposal): Proposal[] {

    let initialBlack = initial.black;
    let initialWhite = initial.white;

    let black = _
        .chain(proposal.black)
        .map((item) => {
            let iB = _.find(initialBlack, (b)=>b.id == item.id);
            return _.merge(item, { weight: iB.weight});
        })
        .sortBy((item) => -item.weight)
        .value();

    let white = _
        .chain(proposal.white)
        .map((item) => {
            let iB = _.find(initialWhite, (b)=>b.id == item.id);
            return _.merge(item, { weight: iB.weight});
        })
        .sortBy((item) => -item.weight)
        .value();

    let result: Proposal[] = [];

    let bucket = {
        black : [],
        white : []
    };

    while (!_.isEmpty(white) || !_.isEmpty(black)) {

        if (_.isEmpty(white)) {
            bucket.black = _.chain(black).map((item) => _.omit(item, ['weight'])).value();
            black = [];
        } else if (_.isEmpty(black)) {
            bucket.white = _.chain(white).map((item) => _.omit(item, ['weight'])).value();
            white = [];
        } else {
            let ww = white[0].weight;
            let bw = black[0].weight;

            bucket.white.push(_.omit(white.shift(), ['weight']));
            bucket.black.push(_.omit(black.shift(), ['weight']));

            if(ww > bw){
                do {
                    if(_.isEmpty(black)) break;
                    let x = black.shift();
                    bucket.black.push(_.omit(x, ['weight']));
                    bw += x.weight;
                } while (ww > bw);
            } else if (ww < bw) {
                do {
                    if(_.isEmpty(white)) break;
                    let x = white.shift();
                    bucket.white.push(_.omit(x, ['weight']));
                    ww += x.weight;
                } while (ww < bw);
            }
        }

        result.push(bucket);

        bucket = {
            black : [],
            white : []
        };
    }

    return result;
}
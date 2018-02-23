import {Position} from "./model/Position";
import {Proposal} from "./model/Proposal";
import {Preference} from "./model/Prefernce";

import _ from 'lodash';

export function propose(initial: Position, consensus?: Proposal) {

    let white = initial.white;
    let black = initial.black;

    // get a joined list of all terms with consensus so far
    if(consensus) {
        let consent = _.concat(
            consensus.black,
            consensus.white);

        // filter valuations from the initial position where there is consensus yet
        white = _.filter(white,
            (item) => !_.find(consent, (i) => i.id == item.id));
        black = _.filter(black,
            (item) => !_.find(consent, (i) => i.id == item.id));
    }

    let terms  = _.map(white, (v1) => {
        let v2 = _.find(black, (v) => v.id == v1.id);
        return {
            id: v1.id,
            black : {
                value : v2.value,
                weight: v2.weight
            },
            white : {
                value: v1.value,
                weight: v1.weight
            }
        }
    });

    let critical = [];
    let disent = {
        black: [],
        white: []
    }

    let consent = {
        black: [],
        white: []
    }

    _.forEach(terms, (term)=> {
        let w = term.white;
        let b = term.black;

        let result: Preference = {
            id: term.id,
            value: null
        }

        if(w.value == b.value) {
            result.value = w.value;
            consent.black.push(result);
            consent.white.push(result);
        } else if(w.weight > b.weight ) {
            result.value = w.value;
            disent.white.push(result);
        } else if(w.weight < b.weight){
            result.value = b.value;
            disent.black.push(result);
        } else {
            critical.push(term);
        }

    });

    // randomly resolve conflicts
    if(critical.length > 0) {
        let d = Math.round(critical.length / 2);

        // randomly pick half of critical items and give to white, rest to black
        let whiteWins = [];
        while (d > 0) {
            let i = Math.round(Math.random() * (critical.length - 1));
            whiteWins = whiteWins.concat(critical.splice(i, 1));
            d--;
        }

        critical.forEach((term) => {
            disent.black.push({
                id: term.id,
                value: term.black.value
            });
        })

        whiteWins.forEach((term) => {
            disent.white.push({
                id: term.id,
                value: term.white.value
            });
        })
    }

    return {disent, consent};
}

// assume proposal is cleared from equal positions
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
import {Position} from "./model/Position";
import {Consensus} from "./model/Consensus";
import _ from 'lodash';
import {Preference} from "./model/Prefernce";

export function propose(initial: Position, consensus?: Consensus): Consensus{

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
        let v2 = _.find(black, (v) => v.id = v1.id);
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
    let results = {
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
            results.black.push(result);
            results.white.push(result);
        } else if(w.weight > b.weight ) {
            result.value = w.value;
            results.white.push(result);
        } else if(w.weight < b.weight){
            result.value = b.value;
            results.black.push(result);
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
            results.black.push({
                id: term.id,
                value: term.black.value
            });
        })

        whiteWins.forEach((term) => {
            results.white.push({
                id: term.id,
                value: term.white.value
            });
        })
    }

    return results;
}

// export function bucketize(initial: Position, proposal: Consensus) {
//     //return ;
// }
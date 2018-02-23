import { propose } from './index';
import {Consensus} from "./model/Proposal";

describe("propose", () => {

    it("different positions fairly", () => {

        let black = [
            { id: "a", value: 10, weight: 1 }
        ];

        let white = [
            { id: "a", value: 5, weight: 0 }
        ];

        let consensus = propose({black, white});

        expect(consensus.disent.white).toHaveLength(0);
        expect(consensus.disent.black).toContainEqual({id: "a", value: 10});
    });

    it("same positions fairly", () => {

        let black = [
            { id: "a", value: 10, weight: 1 }
        ];

        let white = [
            { id: "a", value: 10, weight: 0 }
        ];

        let consensus = propose({black, white});

        expect(consensus.consent.white).toHaveLength(1);
        expect(consensus.consent.white).toContainEqual({id: "a", value: 10});
        expect(consensus.consent.black).toHaveLength(1);
        expect(consensus.consent.black).toContainEqual({id: "a", value: 10});
    });

    it("two critical positions fairly", () => {

        let black = [
            { id: "a", value: 10, weight: .5 },
            { id: "b", value: 10, weight: .5 }
        ];

        let white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 5, weight: 0.5 }
        ];

        let proposal = propose({black, white});

        expect(proposal.disent.white).toHaveLength(1);
        expect(proposal.disent.black).toHaveLength(1);
    });

    it("remaining positions in question fairly", () => {

        let black = [
            { id: "a", value: 10, weight: .5 },
            { id: "b", value: 10, weight: .5 }
        ];

        let white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 10, weight: .5 }
        ];

        let consensus : Consensus  = {
            white : [{id: 'a', value: 5 }],
            black : []
        }

        consensus = propose({black, white}, consensus);

        expect(consensus.consent.white).toHaveLength(1);
        expect(consensus.consent.black).toHaveLength(1);

        expect(consensus.consent.white).toContainEqual({id: 'b', value: 10});
        expect(consensus.consent.black).toContainEqual({id: 'b', value: 10});
    });


});
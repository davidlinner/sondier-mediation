"use strict";
exports.__esModule = true;
var propose_1 = require("./propose");
describe("propose", function () {
    it("different positions fairly", function () {
        var black = [
            { id: "a", value: 10, weight: 1 }
        ];
        var white = [
            { id: "a", value: 5, weight: 0 }
        ];
        var consensus = propose_1.propose({ black: black, white: white });
        expect(consensus.disent.white).toHaveLength(0);
        expect(consensus.disent.black).toContainEqual({ id: "a", value: 10 });
    });
    it("same positions fairly", function () {
        var black = [
            { id: "a", value: 10, weight: 1 }
        ];
        var white = [
            { id: "a", value: 10, weight: 0 }
        ];
        var consensus = propose_1.propose({ black: black, white: white });
        expect(consensus.consent.white).toHaveLength(1);
        expect(consensus.consent.white).toContainEqual({ id: "a", value: 10 });
        expect(consensus.consent.black).toHaveLength(1);
        expect(consensus.consent.black).toContainEqual({ id: "a", value: 10 });
    });
    it("two critical positions fairly", function () {
        var black = [
            { id: "a", value: 10, weight: .5 },
            { id: "b", value: 10, weight: .5 }
        ];
        var white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 5, weight: 0.5 }
        ];
        var proposal = propose_1.propose({ black: black, white: white });
        expect(proposal.disent.white).toHaveLength(1);
        expect(proposal.disent.black).toHaveLength(1);
    });
    it("remaining positions in question fairly", function () {
        var black = [
            { id: "a", value: 10, weight: .5 },
            { id: "b", value: 10, weight: .5 }
        ];
        var white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 10, weight: .5 }
        ];
        var consensus = {
            white: [{ id: 'a', value: 5 }],
            black: []
        };
        var x = propose_1.propose({ black: black, white: white }, consensus);
        expect(x.consent.white).toHaveLength(1);
        expect(x.consent.black).toHaveLength(1);
        expect(x.consent.white).toContainEqual({ id: 'b', value: 10 });
        expect(x.consent.black).toContainEqual({ id: 'b', value: 10 });
    });
});

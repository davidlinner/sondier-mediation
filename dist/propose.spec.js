(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var index_1 = require("./index");
    describe("propose", function () {
        it("different positions fairly", function () {
            var black = [
                { id: "a", value: 10, weight: 1 }
            ];
            var white = [
                { id: "a", value: 5, weight: 0 }
            ];
            var consensus = index_1.propose({ black: black, white: white });
            expect(consensus.white).toHaveLength(0);
            expect(consensus.black).toContainEqual({ id: "a", value: 10 });
        });
        it("same positions fairly", function () {
            var black = [
                { id: "a", value: 10, weight: 1 }
            ];
            var white = [
                { id: "a", value: 10, weight: 0 }
            ];
            var consensus = index_1.propose({ black: black, white: white });
            expect(consensus.white).toHaveLength(1);
            expect(consensus.white).toContainEqual({ id: "a", value: 10 });
            expect(consensus.black).toHaveLength(1);
            expect(consensus.black).toContainEqual({ id: "a", value: 10 });
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
            var consensus = index_1.propose({ black: black, white: white });
            expect(consensus.white).toHaveLength(1);
            expect(consensus.black).toHaveLength(1);
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
            consensus = index_1.propose({ black: black, white: white }, consensus);
            expect(consensus.white).toHaveLength(1);
            expect(consensus.black).toHaveLength(1);
            expect(consensus.white).toContainEqual({ id: 'b', value: 10 });
            expect(consensus.black).toContainEqual({ id: 'b', value: 10 });
        });
    });
});

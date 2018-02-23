"use strict";
exports.__esModule = true;
var index_1 = require("./index");
describe("bucketize", function () {
    it("equal length", function () {
        var black = [
            { id: "a", value: 10, weight: 1 },
            { id: "b", value: 10, weight: 0 }
        ];
        var white = [
            { id: "a", value: 5, weight: 0 },
            { id: "b", value: 5, weight: 1 }
        ];
        var blackWins = [
            { id: "a", value: 10 }
        ];
        var whiteWins = [
            { id: "b", value: 5 }
        ];
        var buckets = index_1.bucketize({ black: black, white: white }, { black: blackWins, white: whiteWins });
        expect(buckets).toHaveLength(1);
        var firstBucket = buckets[0];
        expect(firstBucket.black).toContainEqual({ id: "a", value: 10 });
        expect(firstBucket.white).toContainEqual({ id: "b", value: 5 });
    });
    it("different length", function () {
        var black = [
            { id: "a", value: 10, weight: .75 },
            { id: "b", value: 10, weight: .75 }
        ];
        var white = [
            { id: "a", value: 5, weight: .5 },
            { id: "b", value: 5, weight: .5 }
        ];
        var blackWins = [
            { id: "a", value: 10 },
            { id: "b", value: 10 }
        ];
        var whiteWins = [];
        var buckets = index_1.bucketize({ black: black, white: white }, { black: blackWins, white: whiteWins });
        expect(buckets).toHaveLength(1);
        var firstBucket = buckets[0];
        expect(firstBucket.black).toEqual(expect.arrayContaining([{ id: "a", value: 10 }, { id: "b", value: 5 }]));
        expect(firstBucket.white).toHaveLength(0);
    });
    it("balance bucket on weight", function () {
        var black = [
            { id: "a", value: 10, weight: .9 },
            { id: "b", value: 10, weight: 0 },
            { id: "c", value: 10, weight: 0 },
            { id: "d", value: 10, weight: 0.1 }
        ];
        var white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 5, weight: 0.4 },
            { id: "c", value: 5, weight: 0.1 },
            { id: "d", value: 5, weight: 0 }
        ];
        var blackWins = [
            { id: "a", value: 10 },
            { id: "d", value: 10 }
        ];
        var whiteWins = [
            { id: "b", value: 5 },
            { id: "c", value: 5 }
        ];
        var buckets = index_1.bucketize({ black: black, white: white }, { black: blackWins, white: whiteWins });
        expect(buckets).toHaveLength(2);
        var firstBucket = buckets[0];
        expect(firstBucket.black).toContainEqual({ id: "a", value: 10 });
        expect(firstBucket.white).toEqual(expect.arrayContaining([{ id: "b", value: 5 }, { id: "c", value: 5 }]));
    });
});

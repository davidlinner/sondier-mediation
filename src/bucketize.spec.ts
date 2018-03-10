import { bucketize } from './bucketize';

describe("bucketize", () => {

    it("equal length", () => {

        let black = [
            { id: "a", value: 10, weight: 1 },
            { id: "b", value: 10, weight: 0 }
        ];

        let white = [
            { id: "a", value: 5, weight: 0 },
            { id: "b", value: 5, weight: 1 }
        ];

        let blackWins = [
            { id: "a", value: 10}
        ];

        let whiteWins = [
            { id: "b", value: 5}
        ];

        let buckets = bucketize({black, white}, {black: blackWins, white: whiteWins});

        expect(buckets).toHaveLength(1);

        let firstBucket = buckets[0];

        expect(firstBucket.black).toContainEqual({id: "a", value: 10});
        expect(firstBucket.white).toContainEqual({id: "b", value: 5});
    });


    it("different length", () => {

        let black = [
            { id: "a", value: 10, weight: .75 },
            { id: "b", value: 10, weight: .75 }
        ];

        let white = [
            { id: "a", value: 5, weight: .5 },
            { id: "b", value: 5, weight: .5 }
        ];

        let blackWins = [
            { id: "a", value: 10},
            { id: "b", value: 10}
        ];

        let whiteWins = [
        ];

        let buckets = bucketize({black, white}, {black: blackWins, white: whiteWins});

        expect(buckets).toHaveLength(1);

        let firstBucket = buckets[0];

        expect(firstBucket.black).toEqual(expect.arrayContaining([{id: "a", value: 10}, {id:"b", value: 10}]));
        expect(firstBucket.white).toHaveLength(0);
    });

    it("balance bucket on weight", () => {

        let black = [
            { id: "a", value: 10, weight: .9 },
            { id: "b", value: 10, weight: 0 },
            { id: "c", value: 10, weight: 0 },
            { id: "d", value: 10, weight: 0.1 }
        ];

        let white = [
            { id: "a", value: 5, weight: 0.5 },
            { id: "b", value: 5, weight: 0.4 },
            { id: "c", value: 5, weight: 0.1 },
            { id: "d", value: 5, weight: 0 }
        ];

        let blackWins = [
            { id: "a", value: 10},
            { id: "d", value: 10}
        ];

        let whiteWins = [
            { id: "b", value: 5},
            { id: "c", value: 5}
        ];

        let buckets = bucketize({black, white}, {black: blackWins, white: whiteWins});

        expect(buckets).toHaveLength(2);

        let firstBucket = buckets[0];

        expect(firstBucket.black).toContainEqual({id: "a", value: 10});

        expect(firstBucket.white).toEqual(expect.arrayContaining([{id: "b", value: 5}, {id: "c", value: 5}]));
    });


});
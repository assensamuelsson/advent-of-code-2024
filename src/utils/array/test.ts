import assert from "node:assert";
import { describe, it } from "node:test";

import { product, uniquePairs } from "./index";

describe("Array utils", () => {
  describe("product", () => {
    it("returns correct product", () => {
      const a = [ 1, 2, 3 ];
      const b = [ 4, 5 ];
      const expected = [
        [ 1, 4 ], [ 1, 5 ], [ 2, 4 ], [ 2, 5 ], [ 3, 4 ], [ 3, 5 ],
      ];
      assert.deepStrictEqual(product(a, b), expected);
    });
  });

  describe("uniquePairs", () => {
    [
      { input: [ 1, 2, 3, 4 ], expected: [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ], [ 3, 4 ] ] },
    ].forEach(({ input, expected }) => {
      it(`unique pairs of ${input} should be ${expected}`, () => {
        let i = 0;
        for (const pair of uniquePairs(input)) {
          assert.deepStrictEqual(pair, expected[i]);
          i++;
        }
      });
    });
  });
});

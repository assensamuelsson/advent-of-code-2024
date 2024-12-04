import assert from "node:assert";
import { describe, it } from "node:test";

import { product } from "./index";

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
});

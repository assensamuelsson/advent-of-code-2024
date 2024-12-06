import assert from "node:assert";
import { describe, it } from "node:test";

import { crossProduct } from "./index";

describe("Math utils", () => {
  describe("crossProduct", () => {
    it("returns correct cross product", () => {
      assert.deepStrictEqual(crossProduct([ 0, -1, 0 ], [ 0, 0, -1 ]), [ 1, 0, 0 ]);
      assert.deepStrictEqual(crossProduct([ 1, 2, 3 ], [ 4, 5, 6 ]), [ -3, 6, -3 ]);
    });
  });
});

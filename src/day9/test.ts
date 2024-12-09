import assert from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

import { parse, move, moveWhole } from "./src";

const example = readFileSync(`${import.meta.dirname}/example.txt`, { encoding: "utf8" });

describe("Day9", () => {
  it("parses correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed, {
      head: 2,
      tail: 41,
      buf: [ 0, 0, null, null, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, 9, 9 ],
    });
  });

  it("moves correctly", () => {
    const parsed = parse(example);

    let done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 3,
      tail: 40,
      buf: [ 0, 0, 9, null, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, 9, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 4,
      tail: 39,
      buf: [ 0, 0, 9, 9, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, null, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 5,
      tail: 38,
      buf: [ 0, 0, 9, 9, 8, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, null, null, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 9,
      tail: 37,
      buf: [ 0, 0, 9, 9, 8, 1, 1, 1, 8, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, null, null, null, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 10,
      tail: 36,
      buf: [ 0, 0, 9, 9, 8, 1, 1, 1, 8, 8, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, null, null, null, null, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 11,
      tail: 35,
      buf: [ 0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, null, null, null, null, null, null ],
    });

    done = move(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 13,
      tail: 33,
      buf: [ 0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, 7, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, null, null, null, null, null, null, null, null ],
    });

    while (!move(parsed));

    assert.deepStrictEqual(parsed.buf,
      [ 0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, 7, 7, 7, 3, 3, 3, 6, 4, 4, 6, 5, 5, 5, 5, 6, 6, null, null, null, null, null, null, null, null, null, null, null, null, null, null ]
    );
  });

  it("moves whole file correctly", () => {
    const parsed = parse(example);

    assert.deepStrictEqual(parsed, {
      head: 2,
      tail: 41,
      buf: [ 0, 0, null, null, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, 9, 9 ],
    });

    let done = moveWhole(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 4,
      tail: 39,
      buf: [ 0, 0, 9, 9, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, null, null ],
    });

    done = moveWhole(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 4,
      tail: 34,
      buf: [ 0, 0, 9, 9, null, 1, 1, 1, null, null, null, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, 7, 7, 7, null, 8, 8, 8, 8, null, null ],
    });

    done = moveWhole(parsed);
    assert(!done);
    assert.deepStrictEqual(parsed, {
      head: 4,
      tail: 30,
      buf: [ 0, 0, 9, 9, null, 1, 1, 1, 7, 7, 7, 2, null, null, null, 3, 3, 3, null, 4, 4, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, null, null, null, null, 8, 8, 8, 8, null, null ],
    });

    while (!moveWhole(parsed));

    assert.deepStrictEqual(parsed.buf,
      [ 0, 0, 9, 9, 2, 1, 1, 1, 7, 7, 7, null, 4, 4, null, 3, 3, 3, null, null, null, null, 5, 5, 5, 5, null, 6, 6, 6, 6, null, null, null, null, null, 8, 8, 8, 8, null, null ]
    );
  });
});

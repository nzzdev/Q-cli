import * as Lab from "@hapi/lab";
import { expect } from "@hapi/code";
import { someFunction } from "../src";

// Hapi Lab init code
const lab = Lab.script();
const { describe, it, before } = lab;
export { lab };

describe("Service", () => {
  before(() => {});

  it("should return the konami cheatcode", () => {
    const result = someFunction();
    const expectedResult = "Up, Up, Down, Down, Left, Right, Left, Right, B, A";

    expect(result).to.equal(expectedResult);
  });
});

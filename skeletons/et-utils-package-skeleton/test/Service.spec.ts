import * as Lab from "@hapi/lab";
import { expect } from "@hapi/code";
import { someFunction } from "../src";

// Hapi Lab init code
const lab = Lab.script();
const { describe, it, before } = lab;
export { lab };

describe("Service", () => {
  before(() => {});

  it("should return 'hello world'", () => {
    const result = someFunction();
    const expectedResult = "hello world";

    expect(result).to.equal(expectedResult);
  });
});

import { someFunction } from "../src";

describe("Service", () => {
  it("should return the konami cheatcode", () => {
    const result = someFunction();
    const expectedResult = "Up, Up, Down, Down, Left, Right, Left, Right, B, A";

    expect(result).toEqual(expectedResult);
  });
});

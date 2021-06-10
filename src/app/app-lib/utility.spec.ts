import { stringToRegex } from "./utility";

describe("app-lib/utility", function() {
  describe("stringToRegex()", function() {
    it(`should create RegExp instance from valid regex string`, function() {
      expect(stringToRegex("/[a-z]{2}/gm")).toBe(/[a-z]{2}/gm);
    });
  });
});

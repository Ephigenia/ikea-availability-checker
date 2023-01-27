import {
  normalizeBuCode,
  normalizeCountryCode,
  normalizeProductId,
  unique,
} from "./helper";

describe("normalizeBuCode", function () {
  it("removes everything but the digits", function () {
    expect(normalizeBuCode(" 2X1Ab-#1334")).toBe("211334");
    expect(normalizeBuCode("")).toBe("");
    expect(normalizeBuCode("-_")).toBe("");
  });
});

describe("normalizeProductId", function () {
  it("removes everything but the digits", function () {
    expect(normalizeProductId(" 2X1Ab-#1334")).toBe("211334");
    expect(normalizeProductId("")).toBe("");
  });
});

describe("normalizeCountryCode", function () {
  it("trim, lowercase, strips given code", function () {
    expect(normalizeCountryCode(" DEutschland ")).toBe("de");
    expect(normalizeCountryCode("")).toBe("");
  });
});

describe("unique", function () {
  it("removes dublicates from an array", function () {
    const result = ["a", "a", "A", " A", "a ", "b", "a"].filter(unique);
    expect(result).toEqual(["A", " A", "a ", "b", "a"]);
  });
});

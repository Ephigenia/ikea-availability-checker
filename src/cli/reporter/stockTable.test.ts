import { daysUntil } from "./stockTable";

describe("daysUntil", function () {
  it("returns more than 1 day for days in the future", function () {
    const dates = [new Date("2030-01-08T15:14:49.634Z")];
    const result = daysUntil(dates[0]);
    expect(result).toBeGreaterThanOrEqual(1);
  });
  it("returns 1 for tomorrow date", function () {
    const dates = [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
        new Date().getHours() + 1
      ),
    ];
    const result = daysUntil(dates[0]);
    expect(result).toBe(1);
  });
});

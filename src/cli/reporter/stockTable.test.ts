import { daysUntil } from "./stockTable";

describe('daysUntil', function() {
  it('returns the number comparing with NOW', function() {
    const dates = [
      new Date('2022-01-08T15:14:49.634Z'),
    ];
    const result = daysUntil(dates[0])
    expect(result).toBeGreaterThanOrEqual(1);
  });
});

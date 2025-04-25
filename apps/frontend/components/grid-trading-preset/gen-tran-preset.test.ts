import { describe, expect, it } from "vitest";

import { generateTransactionPreset } from "./gen-tran-preset";

describe("generateTransactionPreset", () => {
  it("should generate correct grid levels with basePrice=100, rise=0.05, fall=0.05", () => {
    const basePrice = 100;
    const rise = 0.05;
    const fall = 0.05;
    const result = generateTransactionPreset(basePrice, rise, fall);

    expect(result).toHaveLength(10); // 预期生成10个网格级别

    // 验证第一个网格级别的买入价格是否等于基准价格
    expect(result[0].buyTriggerPrice).toBeCloseTo(basePrice, 3);

    // 验证每个网格级别的收益率是否等于预期的上涨百分比
    result.forEach((level) => {
      expect(level.profitRate).toBeCloseTo(rise * 100, 3);
    });
  });

  it("should generate correct grid levels with basePrice=50, rise=0.1, fall=0.1", () => {
    const basePrice = 50;
    const rise = 0.1;
    const fall = 0.1;
    const result = generateTransactionPreset(basePrice, rise, fall);

    expect(result).toHaveLength(10);
    expect(result[0].buyTriggerPrice).toBeCloseTo(basePrice, 3);
    result.forEach((level) => {
      expect(level.profitRate).toBeCloseTo(rise * 100, 3);
    });
  });

  it("should handle zero rise and fall", () => {
    const basePrice = 100;
    const rise = 0;
    const fall = 0;
    const result = generateTransactionPreset(basePrice, rise, fall);

    expect(result).toHaveLength(10);
    expect(result[0].buyTriggerPrice).toBeCloseTo(basePrice, 3);
    result.forEach((level) => {
      expect(level.profitRate).toBeCloseTo(0, 3);
    });
  });

  it("should handle negative rise and fall", () => {
    const basePrice = 100;
    const rise = -0.05;
    const fall = -0.05;
    const result = generateTransactionPreset(basePrice, rise, fall);

    expect(result).toHaveLength(10);
    expect(result[0].buyTriggerPrice).toBeCloseTo(basePrice, 3);
    result.forEach((level) => {
      expect(level.profitRate).toBeCloseTo(rise * 100, 3);
    });
  });

  it("should handle very small rise and fall", () => {
    const basePrice = 100;
    const rise = 0.0001;
    const fall = 0.0001;
    const result = generateTransactionPreset(basePrice, rise, fall);

    expect(result).toHaveLength(10);
    expect(result[0].buyTriggerPrice).toBeCloseTo(basePrice, 3);
    result.forEach((level) => {
      expect(level.profitRate).toBeCloseTo(rise * 100, 3);
    });
  });
});

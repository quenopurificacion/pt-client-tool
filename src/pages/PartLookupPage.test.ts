import { validatePartNumber, InvalidPartException } from "@/hooks/usePartValidation";

describe("validatePartNumber()", () => {
  it("accepts valid formats", () => {
    expect(validatePartNumber("1234-abcd")).toBe("1234-abcd");
    expect(validatePartNumber("0000-ABC123")).toBe("0000-abc123");
  });

  it("trims whitespace and still validates", () => {
    expect(validatePartNumber(" 1234-aBcD  ")).toBe("1234-abcd");
  });

  it("rejects invalid formats", () => {
    const invalids = ["123-abcd", "abcd-1234", "1234-abc", "12a4-abcd", "1234_abcde"];
    invalids.forEach((val) => {
      expect(() => validatePartNumber(val)).toThrow(InvalidPartException);
    });
  });
});

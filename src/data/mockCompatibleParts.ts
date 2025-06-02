import type { CompatiblePart } from "@/interface/types";

/**
 * Mock function to fetch compatible parts.
 * slices off the first 4 characters as a prefix, then builds three
 * “compatible” parts: `${prefix}-ALT1`, `${prefix}-ALT2`, and `${prefix}-OEM`.
 */
export const fetchCompatibleParts = async (
  normalized: string
): Promise<CompatiblePart[]> => {

  await new Promise((res) => setTimeout(res, 300));

  const prefix = normalized.slice(0, 4);

  const MOCK_COMPATIBLE_PARTS: CompatiblePart[] = [
    {
      partNumber: `${prefix}-ALT1`,
      description: `Alternative part for ${normalized}`,
      manufacturer: "The Generic Parts Co.",
      price: 45.99,
    },
    {
      partNumber: `${prefix}-ALT2`,
      description: `Compatible replacement for ${normalized}`,
      manufacturer: "Flexi Auto Parts",
      price: 52.5,
    },
    {
      partNumber: `${prefix}-OEM`,
      description: `OEM equivalent for ${normalized}`,
      manufacturer: "QTP Equipment",
      price: 78.25,
    },
  ];

  return MOCK_COMPATIBLE_PARTS;
};

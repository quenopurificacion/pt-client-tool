import type { ExcludedPart } from "@/interface/types";

export class InvalidPartException extends Error {
  constructor(part: string) {
    super(`Invalid part number format: "${part}"`);
    this.name = "InvalidPartException";
  }   
}
  
export const loadExclusions = async (): Promise<ExcludedPart[]> => {
  const data: ExcludedPart[] = (await import("../data/exclusions.json")).default;
  return data;
};
  
/**
 * Validates a part number string against the required format.
 * Throws InvalidPartException if format fails.
 */
export const validatePartNumber = (input: string): string => {
  const part = input.trim();
  const regex = /^[0-9]{4}-[A-Za-z0-9]{4,}$/;

  if (!regex.test(part)) {
    throw new InvalidPartException(part);
  }
  
  return part.toLowerCase();
};
  
/**
 * Checks if the part is in the exclusions list (case-insensitive).
 */
export const isExcluded = (normalizedPart: string, exclusions: ExcludedPart[]): boolean => {
  return exclusions.some(
    (e) => e.PartNumber.toLowerCase() === normalizedPart
  );
};
  
export const pageTitle = "PartsTrader: Part Lookup";
export const pageSubtitle =
  "Enter a part number to validate and find compatible parts.";
export const formPartNumLabel = "Enter Part Number";
export const formPartNumPlaceholder = "e.g., 1234-ABCD";
export const formFormatNote =
  "Format: 4 digits, dash, 4+ alphanumeric (e.g., 1234-ABCD)";

export const lookupButton = {
  idle: "Lookup Part",
  loading: "Checking…",
};
export const clearButton = "Clear";

export const howItWorksTitle = "How It Works";
export const howItWorksList = [
  'Enter a part number in the format "XXXX-YYYY" (4 digits, dash, 4+ alphanumeric characters).',
  "The system validates the format according to PartsTrader specifications.",
  "Valid parts are checked against the exclusions list.",
  "If the part is not excluded, compatible parts are displayed.",
];

export function exclusionMessage(partNumber: string) {
  return `Part ${partNumber} is on the exclusions list and will not be sent to PartsTrader.`;
}

export function successMessage(partNumber: string) {
  return `Part ${partNumber} is valid and compatible parts found:`;
}

export const noCompatiblePartsMessage =
  "No compatible parts found.";

export const genericError = "Something went wrong. Please try again.";

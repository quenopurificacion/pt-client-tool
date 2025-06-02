export interface ExcludedPart {
  PartNumber: string
  Description: string
}

export interface CompatiblePart {
  partNumber: string
  description: string
  manufacturer: string
  price: number
}  
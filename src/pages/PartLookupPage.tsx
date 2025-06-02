import React, { useState } from "react"
import { Button, Input } from "@/components/ui"
import {
  validatePartNumber,
  loadExclusions,
  isExcluded,
  InvalidPartException,
} from "@/hooks/usePartValidation"
import { fetchCompatibleParts } from "@/data/mockCompatibleParts"
import type { CompatiblePart } from "@/interface/types"
import ResultAlert from '@/components/Alert/Result/ResultAlert'

import {
  pageTitle,
  pageSubtitle,
  formPartNumLabel,
  formPartNumPlaceholder,
  formFormatNote,
  lookupButton,
  clearButton,
  howItWorksTitle,
  howItWorksList,
  exclusionMessage,
  successMessage,
  noCompatiblePartsMessage,
  genericError,
} from "@/lib/strings"

export const PartLookupPage: React.FC = () => {
  const [partInput, setPartInput] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const [resultType, setResultType] = useState<
    "error" | "warning" | "success" | null
  >(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [compatibleParts, setCompatibleParts] = useState<CompatiblePart[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultType(null);
    setResultMessage("");
    setCompatibleParts([]);

    let normalized = "";
    try {
      normalized = validatePartNumber(partInput).toUpperCase();
    } catch (err) {
      if (err instanceof InvalidPartException) {
        setResultType("error");
        setResultMessage(err.message);
      } else {
        setResultType("error");
        setResultMessage(genericError);
        console.error(err);
      }
      return;
    }

    setIsLoading(true);
    try {
      const exclusions = await loadExclusions();
      if (isExcluded(normalized.toLowerCase(), exclusions)) {
        setResultType("warning");
        setResultMessage(exclusionMessage(normalized));
      } else {
        const results = await fetchCompatibleParts(normalized);
        setResultType("success");
        setResultMessage(successMessage(normalized));
        setCompatibleParts(results);
      }
    } catch (err) {
      console.error(err);
      setResultType("error");
      setResultMessage(genericError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPartInput("");
    setResultType(null);
    setResultMessage("");
    setCompatibleParts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-blue-900 text-center">{pageTitle}</h1>
      <p className="mt-2 text-gray-600 text-center">{pageSubtitle}</p>
      <hr className="w-full max-w-2xl border-gray-300 my-6" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white border border-blue-200 rounded-lg shadow p-6"
        aria-labelledby="lookup-form-title"
      >
        <label
          htmlFor="partNumber"
          className="block text-sm font-medium text-gray-700"
        >
          {formPartNumLabel}
        </label>
        <div className="mt-1 flex space-x-3">
          <Input
            id="partNumber"
            name="partNumber"
            type="text"
            placeholder={formPartNumPlaceholder}
            value={partInput}
            onChange={(e) => setPartInput(e.target.value)}
            aria-required="true"
            aria-invalid={resultType === "error" ? "true" : "false"}
            className="flex-1 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6"
            aria-label="Lookup Part"
            variant="primary"
          >
            {isLoading ? lookupButton.loading : lookupButton.idle}
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {formFormatNote}
        </p>
      </form>

      {/* === Result Card === */}
      {resultType && (
        <>
          <div
            className={`
              relative mt-8 w-full max-w-2xl rounded-lg p-6 
              ${resultType === "error" ? "bg-red-100 border-l-4 border-red-500" : ""} 
              ${resultType === "warning" ? "bg-yellow-100 border-l-4 border-yellow-500" : ""} 
              ${resultType === "success" ? "bg-green-100 border-l-4 border-green-500" : ""}
            `}
            role="region"
            aria-live="polite"
            aria-atomic="true"
          >
            <ResultAlert type={resultType} message={resultMessage} />

            {resultType === "success" && compatibleParts.length > 0 && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {compatibleParts.map((cp) => (
                  <div
                    key={cp.partNumber}
                    className="bg-white rounded-lg border border-blue-200 p-4 shadow"
                  >
                    <div className="text-lg font-medium text-gray-800 mb-1">
                      {cp.partNumber}
                    </div>
                    <div className="text-sm text-gray-600 mb-2 wrap-break-word">
                      {cp.description}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Manufacturer:</span>{" "}
                      {cp.manufacturer}
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Price:</span> $
                      {cp.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resultType === "warning" && compatibleParts.length === 0 && (
              <div className="mt-4">
                <ResultAlert type="warning" message={noCompatiblePartsMessage} />
              </div>
            )}

            <Button
              onClick={handleClear}
              className="mt-4 rounded-md bg-gray-500 px-3 py-1 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Clear results"
            >
              {clearButton}
            </Button>
          </div>
        </>
      )}

      {/* === How It Works Card === */}
      <div className="mt-8 w-full max-w-2xl bg-white border border-blue-200 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {howItWorksTitle}
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          {howItWorksList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PartLookupPage;

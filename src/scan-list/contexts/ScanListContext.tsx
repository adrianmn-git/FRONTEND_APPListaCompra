"use client";

import React, { createContext, useState } from "react";
import { ScanResult } from "../entity/ScanResult";
import { ScanListRepository } from "./data/ScanListRepository";
import { useNotification } from "@/notifications/hooks/useNotification";
import { useI18n } from "@/i18n/hooks/useI18n";

type ScanListContextType = {
  scanResult: ScanResult | null;
  isScanning: boolean;
  scanError: string | null;
  scanImages: (files: File[]) => Promise<void>;
  resetScan: () => void;
};

const ScanListContext = createContext<ScanListContextType | undefined>(undefined);

export const ScanListProvider = ({ children }: { children: React.ReactNode }) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const { success, error } = useNotification();
  const { t } = useI18n();

  const repository = ScanListRepository.live();

  const scanImages = async (files: File[]) => {
    setIsScanning(true);
    setScanError(null);
    setScanResult(null);
    try {
      const result = await repository.scanImages(files);
      setScanResult(result);
      success(
        t("scan.success_message", {
          name: result.list.name,
          count: String(result.items_created),
          defaultValue: `List "{{name}}" created with {{count}} products`,
        })
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setScanError(msg);
      error(
        t("scan.error_scan", { defaultValue: "Error scanning images" })
      );
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanError(null);
  };

  return (
    <ScanListContext.Provider
      value={{ scanResult, isScanning, scanError, scanImages, resetScan }}
    >
      {children}
    </ScanListContext.Provider>
  );
};

export default ScanListContext;

import { useContext } from "react";
import ScanListContext from "../contexts/ScanListContext";

export const useScanList = () => {
  const context = useContext(ScanListContext);
  if (!context) {
    throw new Error("useScanList must be used within a ScanListProvider");
  }
  return context;
};

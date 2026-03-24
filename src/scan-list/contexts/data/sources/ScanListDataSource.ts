import { ScanResult } from "../../../entity/ScanResult";

const API_URL = "http://127.0.0.1:8000";

export class ScanListDataSource {
  async scanImages(files: File[]): Promise<ScanResult> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await fetch(`${API_URL}/lists/scan`, {
      method: "POST",
      body: formData,
    });

    if (res.status === 409) {
      const data = await res.json();
      throw new Error(data.error || "List already exists");
    }

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error scanning images");
    }

    return res.json();
  }
}

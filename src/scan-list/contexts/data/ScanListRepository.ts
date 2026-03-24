import { ScanResult } from "../../entity/ScanResult";
import { ScanListDataSource } from "./sources/ScanListDataSource";

export class ScanListRepository {
  constructor(
    private readonly datasource: ScanListDataSource
  ) {}

  public static live(
    networkDatasource: () => ScanListDataSource = () =>
      new ScanListDataSource()
  ): ScanListRepository {
    return new ScanListRepository(networkDatasource());
  }

  async scanImages(files: File[]): Promise<ScanResult> {
    return await this.datasource.scanImages(files);
  }
}

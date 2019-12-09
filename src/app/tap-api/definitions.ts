import {
  Bundle as BundleModel,
  Bundle
} from "@iotize/device-client.js/device/target-variable/bundle";
import { VariableInteraction } from "@iotize/device-client.js/device/target-variable/variable-interaction.interface";
import { DataManager as BaseDataManager } from "@iotize/ionic";
import { bundles as bundlesConfig } from "./tap-config";
import { Tap } from "@iotize/device-client.js/device";
import { BundleConfig, VariableConfig } from "@iotize/device-admin.js";
import { BodyConverter } from "@iotize/device-client.js/device/converter/import-adapter";

export type AppBundleConfig = BundleConfig & {
  variables: AppVariableConfig[];
};

export type AppVariableConfig = VariableConfig & {
  converter?: BodyConverter<any>;
};

export namespace SensorDemo {
  interface Bundles {
    /**
     * Bundle  Count_Status
     * Id: 0
     */
    countStatus: DataType.CountStatus;

    /**
     * Bundle  MySensors
     * Id: 1
     */
    mySensors: DataType.MySensors;

    /**
     * Bundle  Count_Control
     * Id: 2
     */
    countControl: DataType.CountControl;
  }

  export namespace DataType {
    export interface CountStatus {
      /**
       * Variable  Count
       * Id: 4
       */
      Count: number; // INT32;

      /**
       * Variable  LEDStatus
       * Id: 7
       */
      LEDStatus: number; // UINT8;
    }

    export interface MySensors {
      /**
       * Variable  Voltage_V
       * Id: 1
       */
      Voltage_V: number; // FLOAT32;

      /**
       * Variable  Temperature_C
       * Id: 2
       */
      Temperature_C: number; // FLOAT32;
    }

    export interface CountControl {
      /**
       * Variable  LEDConfig
       * Id: 13
       */
      LEDConfig: number; // UINT8;

      /**
       * Variable  Period
       * Id: 0
       */
      Period: number; // INT32;
    }
  }

  export type VariableByType = DataType.CountStatus &
    DataType.MySensors &
    DataType.CountControl;
  export type VariableKey = keyof DataType.CountStatus &
    DataType.MySensors &
    DataType.CountControl;

  export type BundleKey = keyof Bundles;
  export type BundleByType = Bundles;

  export interface Variables {
    /**
     * Variable  Count
     * Id: 4
     */
    Count: number; // INT32;

    /**
     * Variable  LEDStatus
     * Id: 7
     */
    LEDStatus: number; // UINT8;

    /**
     * Variable  Voltage_V
     * Id: 1
     */
    Voltage_V: number; // FLOAT32;

    /**
     * Variable  Temperature_C
     * Id: 2
     */
    Temperature_C: number; // FLOAT32;

    /**
     * Variable  LEDConfig
     * Id: 13
     */
    LEDConfig: number; // UINT8;

    /**
     * Variable  Period
     * Id: 0
     */
    Period: number; // INT32;
  }

  export interface Bundle {
    countStatus: BundleModel<SensorDemo.DataType.CountStatus>;

    mySensors: BundleModel<SensorDemo.DataType.MySensors>;

    countControl: BundleModel<SensorDemo.DataType.CountControl>;
  }

  export interface Data {
    bundles: Bundle;
    Bundle<T extends BundleKey>(key: T): BundleModel<BundleByType[BundleKey]>;
    variables: Variables;
    variable<T extends VariableKey>(
      key: T
    ): VariableInteraction<VariableByType[T]>;
  }

  export class DataManager extends BaseDataManager<
    SensorDemo.VariableByType,
    SensorDemo.VariableKey,
    SensorDemo.BundleByType,
    SensorDemo.BundleKey
  > {
    static create(tap: Tap): DataManager {
      return new DataManager(
        tap,
        BaseDataManager.createDataFromSchemaConfig(
          tap,
          bundlesConfig as any
        ) as any
      );
    }
  }
}

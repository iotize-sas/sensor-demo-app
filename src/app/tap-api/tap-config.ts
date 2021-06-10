import {
  PipeConverter,
  ByteSwapConverter,
  ArrayConverter,
  NumberConverter,
  StringConverter,
  FloatConverter,
  BooleanConverter
} from "@iotize/tap/client/impl";
import { TapDataManagerConfig } from "@iotize/tap/data";
import { SensorDemoDataApi } from "./definitions";

export const dataManagerConfig: TapDataManagerConfig<SensorDemoDataApi.Data> = {
  bundles: {
    count_Status: {
      id: 0, // Count_Status
      variables: {
        count: {
          id: 4,
          converter: NumberConverter.int32()
        },

        lEDStatus: {
          id: 7,
          converter: NumberConverter.uint8()
        }
      }
    },

    sensors: {
      id: 1, // Sensors
      variables: {
        voltage_V: {
          id: 1,
          converter: FloatConverter.instance32()
        },

        temperature_C: {
          id: 2,
          converter: FloatConverter.instance32()
        }
      }
    },

    count_Control: {
      id: 2, // Count_Control
      variables: {
        period: {
          id: 0,
          converter: NumberConverter.int32()
        },

        lEDConfig: {
          id: 13,
          converter: NumberConverter.uint8()
        }
      }
    }
  }
};

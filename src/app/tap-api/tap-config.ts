import {
  PipeConverter,
  ByteSwapConverter,
  ArrayConverter
} from "@iotize/device-client.js";
import {
  NumberConverter,
  StringConverter,
  FloatConverter,
  BooleanConverter
} from "@iotize/device-client.js/client/impl";

export const bundles = [
  {
    id: 0,
    name: "Count_Status",
    variables: [
      {
        id: 4,
        length: 1,
        type: "INT32",
        name: "Count",
        converter: NumberConverter.int32Instance()
      },

      {
        id: 7,
        length: 1,
        type: "UINT8",
        name: "LEDStatus",
        converter: NumberConverter.uint8Instance()
      }
    ]
  },

  {
    id: 1,
    name: "MySensors",
    variables: [
      {
        id: 1,
        length: 1,
        type: "FLOAT32",
        name: "Voltage_V",
        converter: FloatConverter.instance32()
      },

      {
        id: 2,
        length: 1,
        type: "FLOAT32",
        name: "Temperature_C",
        converter: FloatConverter.instance32()
      }
    ]
  },

  {
    id: 2,
    name: "Count_Control",
    variables: [
      {
        id: 13,
        length: 1,
        type: "UINT8",
        name: "LEDConfig",
        converter: NumberConverter.uint8Instance()
      },

      {
        id: 0,
        length: 1,
        type: "INT32",
        name: "Period",
        converter: NumberConverter.int32Instance()
      }
    ]
  }
];

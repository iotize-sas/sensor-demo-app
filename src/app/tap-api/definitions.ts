export namespace SensorDemoDataApi {
  export namespace Bundle {
    /**
     * Bundle id: 0
     */
    export interface CountStatus {
      /**
       * Variable id: 4
       */
      count: number;

      /**
       * Variable id: 7
       */
      lEDStatus: number;
    }

    /**
     * Bundle id: 1
     */
    export interface Sensors {
      /**
       * Variable id: 1
       */
      voltage_V: number;

      /**
       * Variable id: 2
       */
      temperature_C: number;
    }

    /**
     * Bundle id: 2
     */
    export interface CountControl {
      /**
       * Variable id: 0
       */
      period: number;

      /**
       * Variable id: 13
       */
      lEDConfig: number;
    }
  }

  export interface Data {
    count_Status: Bundle.CountStatus;

    sensors: Bundle.Sensors;

    count_Control: Bundle.CountControl;
  }
}

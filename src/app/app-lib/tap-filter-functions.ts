import { stringToRegex } from "./utility";
import { CurrentDeviceService, TapInfo } from "@iotize/ionic";
import { READ_CONFIGURATOR_CONFIG } from "@iotize/tap/configurator";

import { ReadConfigKey } from "@iotize/tap/configurator";

interface FilterFunctionContext {
  tapService: CurrentDeviceService;
}

export async function executeTapFilterByTapInfo(
  filter: {
    key: TapInfo;
    match: RegExp | string;
  },
  context: FilterFunctionContext
): Promise<boolean> {
  const value = (await context.tapService.getValue(filter.key)).toString();
  const regex =
    typeof filter.match === "string"
      ? stringToRegex(filter.match)
      : filter.match;
  return regex.test(value);
}

export async function executeTapFilterByConfigKey(
  filter: {
    key: ReadConfigKey;
    match: RegExp | string;
  },
  context: FilterFunctionContext
): Promise<boolean> {
  if (!(filter.key in READ_CONFIGURATOR_CONFIG)) {
    console.warn('Invalid read config key "${filter.key"}');
    return false;
  }
  const readConfigCall = READ_CONFIGURATOR_CONFIG[filter.key]({
    service: context.tapService.tap.service,
    param: undefined
  });
  if (readConfigCall instanceof Error) {
    return false;
  }
  const value = (
    await context.tapService.tap.lwm2m.execute(readConfigCall)
  ).body();
  const regex =
    typeof filter.match === "string"
      ? stringToRegex(filter.match)
      : filter.match;
  return regex.test(value);
}

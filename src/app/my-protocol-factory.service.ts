import { WebSocketProtocol } from "@iotize/device-com-websocket.js/web-socket-protocol";
import { NFCComProtocol } from "@iotize/device-com-nfc.cordova";

import { BLEComProtocol } from "@iotize/cordova-plugin-iotize-ble";
import { WebBluetoothProtocol } from "@iotize/device-com-web-bluetooth.js";

import {
  isIoTizeWebView,
  WebViewComProtocol
} from "@iotize/device-com-webview.js";

import { DeviceScanner } from "@iotize/device-client.js/device/scanner/device-scanner";
import { WifiComProtocol } from "@iotize/device-com-wifi.cordova";
import { CordovaSocketProtocol } from "@iotize/device-com-socket.cordova";
import {
  ProtocolMetaNfc,
  ProtocolMetaWifi,
  ProtocolMetaSocket,
  ProtocolMetaBle,
  ProtocolMetaWebview
} from "@iotize/ionic";
import { ProtocolFactoryService, ProtocolMeta } from "@iotize/ionic";
import { ComProtocol } from "@iotize/device-client.js/protocol/api";
import { filter, timeout, finalize, first, map } from "rxjs/operators";
import { Platform } from "@ionic/angular";
import getDebugger from "./logger";
const debug = getDebugger("MyProtocolFactoryService");

export const PROTOCOL_FACTORY_CONFIG = {
  nfc: function(meta: ProtocolMetaNfc, platform: Platform) {
    if (platform.is("ios")) {
      return NFCComProtocol.iOSProtocol();
    } else {
      return new NFCComProtocol();
    }
  },

  wifi: function(meta: ProtocolMetaWifi) {
    let wifiProtocol = new WifiComProtocol(
      {
        network: {
          SSID: meta.info.ssid,
          password: meta.info.password,
          algorithm: meta.info.algorithm
        },
        socket: {
          url: meta.info.url || "tcp://192.168.1.50:2000"
        }
      },
      options => {
        const url = parseUrl(options.socket.url);
        if (!url.hostname || url.hostname === "0.0.0.0") {
          throw new Error(
            `Invalid host name "${url.hostname}". Make sure your tap is properly connected to the network`
          );
        }
        debug("Parse url", options.socket.url, url);
        return new CordovaSocketProtocol({
          host: url.hostname,
          port: url.port
        });
      }
    );
    wifiProtocol.options.connect.timeout = 20000;
    return wifiProtocol;
  },

  socket: function(meta: ProtocolMetaSocket, platform: Platform) {
    const url = parseUrl(meta.info.url);
    debug("Parse url", meta.info.url, url);
    if (platform.is("cordova")) {
      let socketOptions = {
        host: url.hostname,
        port: url.port
      };
      debug("socket with options", socketOptions);
      return new CordovaSocketProtocol(socketOptions);
    } else {
      throw new Error(`Sockets are not supported on your device`);
    }
  },

  websocket: function(
    meta: ProtocolMetaSocket,
    platform: Platform
  ): WebSocketProtocol {
    return new WebSocketProtocol({
      url: meta.info.url
    });
  },

  ble: async function(
    meta: ProtocolMetaBle,
    platform: Platform,
    bleScanner: DeviceScanner<any>
  ): Promise<ComProtocol> {
    if (platform.is("ios")) {
      debug("Create ble protocol for IOS", meta);
      if (!meta.info.id) {
        if (meta.info.name) {
          let obs = await bleScanner.results.pipe(
            filter(
              entries =>
                entries.find(entry => entry.name == meta.info.name) !==
                undefined
            ),
            first(),
            map(entries => entries.find(entry => entry.name == meta.info.name)),
            timeout(10000), // TODO argument
            finalize(() => bleScanner.stop())
          );
          bleScanner.start();
          let deviceInfo = await obs.toPromise();
          meta.info.id = deviceInfo.address;
        } else {
          throw new Error(
            `Missing device name for iOS connection. Given: ${JSON.stringify(
              meta
            )}`
          );
        }
      }
      return new BLEComProtocol(meta.info.id);
    } else if (meta.info.mac) {
      return new BLEComProtocol(meta.info.mac);
    } else if (meta.info.webBluetooth) {
      let protocol = new WebBluetoothProtocol(meta.info.webBluetooth);
      protocol.options.connect.timeout = 4000;
      protocol.options.send.timeout = 4000;
      protocol.options.disconnect.timeout = 4000;
      return protocol;
    } else {
      throw new Error(
        `Missing information to create BLE communication protocol. Given: ${JSON.stringify(
          meta
        )}`
      );
    }
  },

  webview: function(meta: ProtocolMetaWebview) {
    if (isIoTizeWebView()) {
      return new WebViewComProtocol();
    } else {
      throw new Error(`Application is not running inside a valid webview.`);
    }
  }
};

export class MyProtocolFactoryService implements ProtocolFactoryService {
  public protocolFactories = PROTOCOL_FACTORY_CONFIG;

  constructor(
    public platform: Platform,
    public bleScanner: DeviceScanner<any>
  ) {}

  public create(meta: ProtocolMeta): ComProtocol | Promise<ComProtocol> {
    if (meta.type in this.protocolFactories) {
      return this.protocolFactories[meta.type](
        meta,
        this.platform,
        this.bleScanner
      );
    }
    throw new Error(`Unsupported protocol type "${meta.type}"`);
  }

  public isValid(meta: ProtocolMeta): boolean {
    return meta.type in this.protocolFactories;
  }
}

/**
 * Example: http://username:password@localhost:257/deploy/?asd=asd#asd
 */
function parseUrl(url: string) {
  var m = url.match(
      /^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/
    ),
    r = {
      hash: m[10] || "", // #asd
      host: m[3] || "", // localhost:257
      hostname: m[6] || "", // localhost
      href: m[0] || "", // http://username:password@localhost:257/deploy/?asd=asd#asd
      origin: m[1] || "", // http://username:password@localhost:257
      pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
      port: m[7] || "", // 257
      protocol: m[2] || "", // http:
      search: m[9] || "", // ?asd=asd
      username: m[4] || "", // username
      password: m[5] || "" // password
    };
  if (r.protocol.length == 2) {
    r.protocol = "file:///" + r.protocol.toUpperCase();
    r.origin = r.protocol + "//" + r.host;
  }
  r.href = r.origin + r.pathname + r.search + r.hash;
  return m && r;
}

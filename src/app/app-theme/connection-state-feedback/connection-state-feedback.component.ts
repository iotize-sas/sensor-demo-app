import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import {
  ConnectionStateChangeEvent,
  ConnectionState
} from "@iotize/tap/protocol/api";
import { Subscription } from "rxjs";

@Component({
  selector: "tap-connection-state-feedback",
  templateUrl: "./connection-state-feedback.component.html",
  styleUrls: ["./connection-state-feedback.component.scss"]
})
export class ConnectionStateFeedbackComponent implements OnInit, OnDestroy {
  state: ConnectionState = ConnectionState.DISCONNECTED;
  subscription?: Subscription;
  isClosed: boolean = false;

  @Input() card: boolean = true;

  constructor(public deviceService: CurrentDeviceService) {}

  ngOnInit() {
    this.state =
      this.deviceService.hasTap && this.deviceService.tap.isConnected()
        ? ConnectionState.CONNECTED
        : ConnectionState.DISCONNECTED;
    this.subscription = this.deviceService.connectionState.subscribe(
      (newState: ConnectionStateChangeEvent) => {
        this.onTapConnectionStateChange(newState);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTapConnectionStateChange(state: ConnectionStateChangeEvent) {
    this.isClosed = false;
    this.state = state.newState;
  }

  get message(): string {
    switch (this.state) {
      case ConnectionState.DISCONNECTED:
        return "You are disconnected from device";
      case ConnectionState.CONNECTING:
        return "Reconnecting...";
      case ConnectionState.DISCONNECTING:
        return "Disconnecting...";
      default:
        return "";
    }
  }

  get show(): boolean {
    return !this.isClosed && this.state != ConnectionState.CONNECTED;
  }

  get loading(): boolean {
    return (
      this.state == ConnectionState.CONNECTING ||
      this.state == ConnectionState.DISCONNECTING
    );
  }

  get showReconnect(): boolean {
    return this.state == ConnectionState.DISCONNECTED;
  }

  reconnect() {
    this.deviceService.connect();
  }
}

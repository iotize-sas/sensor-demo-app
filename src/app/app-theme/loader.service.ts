import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";
import getDebugger from "src/app/logger";
import { ToastService } from "./toast.service";

const debug = getDebugger("LoaderService");

type TaskType = (loader: any) => Promise<any>;

interface LoadEvent {
  message: string;
  [key: string]: any;
}

type LoadEventType = string | LoadEvent;

interface Task {
  message: string;
  task?: TaskType;
  stream?: Observable<LoadEventType | any>;
  // cancelable?: boolean // TODO
}

@Injectable({
  providedIn: "root"
})
export class LoaderService {
  tasks: any;
  loader: any;
  loading: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    private toastService: ToastService
  ) {}

  addTask(task: Task): Promise<any> {
    if (this.loading) {
      return Promise.reject(new Error(`App is already loading...`));
    }
    return this.runTask(task);
  }

  private async runTask(taskInfo: Task): Promise<any> {
    await this.showLoader(taskInfo.message || "Loading...");
    if (taskInfo.task) {
      let p = taskInfo.task(this.loader);
      p.catch(err => {
        this._onError(err);
      }).then(() => {
        this.hideLoader();
      });
      return p;
    } else if (taskInfo.stream) {
      let sharedStream = taskInfo.stream.pipe(share());
      sharedStream.subscribe({
        next: (value: LoadEventType) => {
          if (typeof value == "string") {
            this.showLoader(value);
          } else if (value.message) {
            this.showLoader(value.message);
          }
        },
        error: err => {
          this._onError(err);
        },
        complete: () => {
          this.hideLoader();
        }
      });
      return sharedStream.toPromise();
    } else {
      throw new Error(`Invalid task ${JSON.stringify(taskInfo)}`);
    }
  }

  _onError(err: Error) {
    this.hideLoader();
    this.toastService.error(err);
  }

  hideLoader() {
    this.loading = false;
    if (this.loader) {
      this.loader.dismiss();
      this.loader = undefined;
      debug(`REMOVING loader`);
    }
  }

  async showLoader(msg: string) {
    debug(`showLoader ${msg}`);
    this.loading = true;
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({
        message: msg
      });
      if (this.loading) {
        await this.loader.present();
      }
    } else {
      this.loader.message = msg;
    }
  }
}

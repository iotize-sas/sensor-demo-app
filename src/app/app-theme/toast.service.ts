import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class ToastService {
  async success(options: { message: string }) {
    let toast = await this.toast.create({
      ...options,
      ...{
        color: "success",
        duration: 3000
      }
    });
    toast.present();
  }

  async error(options: { message: string } | Error) {
    if (options instanceof Error) {
      options = {
        message: options.message
      };
    }
    let toast = await this.toast.create({
      ...options,
      ...{
        color: "danger",
        duration: 3000
      }
    });
    toast.present();
  }

  constructor(protected toast: ToastController) {}
}

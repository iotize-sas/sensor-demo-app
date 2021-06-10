import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UniquePromiseCallService {
  pending: Record<string, Promise<any>> = {};

  constructor() {}

  execute<T>(queueId: string, promiseFactory: () => Promise<T>): Promise<T> {
    if (this.pending[queueId]) {
      return this.pending[queueId];
    } else {
      try {
        return (this.pending[queueId] = promiseFactory()
          .then(result => {
            delete this.pending[queueId];
            return result;
          })
          .catch(err => {
            delete this.pending[queueId];
            throw err;
          }));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
}

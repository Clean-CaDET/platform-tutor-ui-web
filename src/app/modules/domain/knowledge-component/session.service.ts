import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import * as signalR from "@microsoft/signalr";
import {ACCESS_TOKEN} from '../../../shared/constants'

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private connection: signalR.HubConnection

  launchSession(kcId: number, learnerId: number) {
    if (this.connection) {
      this.connection.stop().then(() => this.connectAndLaunch(kcId, learnerId));
    } else {
      this.connectAndLaunch(kcId, learnerId);
    }
  }

  terminateSession() {
    this.connection.stop();
  }

  private connectAndLaunch(kcId: number, learnerId: number) {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(environment.apiHost + 'session', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => localStorage.getItem(ACCESS_TOKEN)
    })
    .build();

    this.connection.start()
    .then(() => this.connection.send("launchSession", kcId, learnerId))
    .catch(err => console.log(err));
  }
}

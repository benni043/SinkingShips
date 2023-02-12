import {Component, HostListener} from '@angular/core';
import {Status} from "../../../Server";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  playerName: string = "";
  serverName: string = "";

  loggedIn: boolean = false;
  gameEnd: boolean = false;

  login: {serverName: string, playerName: string} = {
    serverName: '',
    playerName: ''
  };

  leaveLobby() {
    this.loggedIn = false;

    fetch(`${environment.backendUrl}/playerLeft`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this.login)
    }).then().catch()

    this.gameEnd = false;
  }

  // @HostListener('window:beforeunload', ['$event'])
  // handleBeforeUnload(event: Event) {
  //   this.leaveLobby();
  // }

  actPlayer = "";

  async send($event: { playerName: string; serverName: string }) {
    this.playerName = $event.playerName
    this.serverName = $event.serverName

    this.login = {playerName: $event.playerName, serverName: $event.serverName}

    let status = await this.check();

    switch (status) {
      case Status.full: {
        alert("Diese Lobby ist bereits voll!");
        break
      }
      case Status.join: {
        await fetch(`${environment.backendUrl}/addGame`, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(this.login)
        });

        this.loggedIn = true;
        break
      }
      case Status.rejoin: {
        this.loggedIn = true;
        break
      }
    }

    let interval = setInterval(async () => {
      let response = await fetch(`${environment.backendUrl}/isGameFinished?serverName=` + this.serverName);
      let json = await response.json();

      let server = json.server;

      if(server.isSpieler1AmZug) {
        this.actPlayer = server.spieler1.name
      } else {
        this.actPlayer = server.spieler2.name
      }

      if (json.finished) {
        clearInterval(interval);

        if(server.isSpieler1AmZug) {
          this.actPlayer = server.spieler2.name
        } else {
          this.actPlayer = server.spieler1.name
        }

        this.gameEnd = true;
      }
    }, 100)
  }

  async check(): Promise<Status> {
    let response = await fetch(`${environment.backendUrl}/check`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(this.login)
    });

    let json = await response.json();

    return json.status;
  }

}

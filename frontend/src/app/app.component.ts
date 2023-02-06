import {Component, HostListener, OnInit} from '@angular/core';
import {Status} from "../../../Server";
import {TimeInterval} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {

  }
  title = 'frontend';

  playerName: string = "";
  serverName: string = "";
  loggedIn: boolean = false;
  gameEnd: boolean = false;

  async leaveLobby() {
    clearInterval(this.interval);

    let login = {serverName: this.serverName, playerName: this.playerName}

    await fetch("/playerLeft", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(login)
    })

    this.loggedIn = false;
    this.gameEnd = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // let login = {serverName: this.serverName, playerName: this.playerName}

    // fetch("/playerLeft", {
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   method: "POST",
    //   body: JSON.stringify(login)
    // }).then(r => console.log("then")).catch(reason => console.log(reason));

    this.leaveLobby().then(r => console.log("then")).catch(reason => console.log(reason));
  }

  interval: any;
  async send($event: { playerName: string; serverName: string }) {
    this.playerName = $event.playerName;
    this.serverName = $event.serverName;

    this.interval = setInterval(async () => {
      let response = await fetch("/isGameFinished?serverName=" + this.serverName);
      let json = await response.json();

      if(json.finished) this.gameEnd = true;
    }, 1000)

    let status = await this.check();

    if (status === Status.full) {
      alert("room is full")
    } else if (status === Status.join) {
      let login = {serverName: this.serverName, playerName: this.playerName}

      await fetch("/addGame", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(login)
      });

      this.loggedIn = true;
    } else if(status === Status.rejoin) {
      this.loggedIn = true;
    }
  }

  async check(): Promise<Status> {
    let login = {serverName: this.serverName, playerName: this.playerName}

    let response = await fetch("/check", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(login)
    });

    let json = await response.json();

    return json.status;
  }

}

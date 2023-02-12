import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Feld, FeldState} from "../../../../Server";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-guess-play-field',
  templateUrl: './guess-play-field.component.html',
  styleUrls: ['./guess-play-field.component.css']
})
export class GuessPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    let interval = setInterval(async () => {
      if (this.gegnerName === "" || this.gegnerName === undefined) {
        let response = await fetch(`${environment.backendUrl}/opponent?serverName=` + this.serverName + "&playerName=" + this.playerName);
        let json = await response.json();

        this.gegnerName = json.opponent;
      } else {
        clearInterval(interval);
      }
    })

    let interval2 = setInterval(async () => {
      let response2 = await fetch(`${environment.backendUrl}/isStarted?serverName=` + this.serverName);
      let json2 = await response2.json();

      if (json2.started) {
        this.started = true;
        clearInterval(interval2);
      }
    }, 100)

    await this.setPlayField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";
  playField: Feld = []

  @Input() gameEnd: boolean = false;
  gegnerName: string = "";
  async setField(cords: { x: number; y: number }) {
    if(!this.started) return;
    await this.send(cords.x, cords.y);
  }

  started: boolean = false;

  async send(x: number, y: number) {
    let cords = {x: x, y: y, playerName: this.playerName, serverName: this.serverName};

    let response = await fetch(`${environment.backendUrl}/postGuessFieldCords`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(cords)
    });

    let json = await response.json();

    if(json.isPlayerAmZug) {
      await this.setPlayField();
    } else {
      alert(this.gegnerName + " ist am Zug!")
    }
  }

  async setPlayField() {
    let response = await fetch(`${environment.backendUrl}/getGuessField?playerName=` + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

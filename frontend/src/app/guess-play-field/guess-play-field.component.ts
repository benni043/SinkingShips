import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Feld, FeldState} from "../../../../Server";

@Component({
  selector: 'app-guess-play-field',
  templateUrl: './guess-play-field.component.html',
  styleUrls: ['./guess-play-field.component.css']
})
export class GuessPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    let interval = setInterval(async () => {
      if (this.gegnerName === "" || this.gegnerName === undefined) {
        let response = await fetch("http://10.0.0.48:3000/opponent?serverName=" + this.serverName + "&playerName=" + this.playerName);
        let json = await response.json();

        this.gegnerName = json.opponent;
      } else {
        clearInterval(interval);
      }
    })

    let interval2 = setInterval(async () => {
      let response2 = await fetch("http://10.0.0.48:3000/isStarted?serverName=" + this.serverName);
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
  oldX: number = 0;
  oldY: number = 0;

  async send(x: number, y: number) {
    let cords = {x: x, y: y, oldY: this.oldY, oldX: this.oldX, playerName: this.playerName, serverName: this.serverName};

    let response = await fetch("http://10.0.0.48:3000/postGuessFieldCords", {
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

    this.oldX = x;
    this.oldY = y;
  }

  async setPlayField() {
    let response = await fetch("http://10.0.0.48:3000/getGuessField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

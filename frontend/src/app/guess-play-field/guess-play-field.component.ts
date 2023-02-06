import {Component, Input, OnInit} from '@angular/core';
import {createEmptyField, FeldState} from "../../../../Server";

@Component({
  selector: 'app-guess-play-field',
  templateUrl: './guess-play-field.component.html',
  styleUrls: ['./guess-play-field.component.css']
})
export class GuessPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    await this.setPlayField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";
  playField: FeldState[][] = []

  async setField(cords: { x: number; y: number }) {
    let response = await fetch("/isStarted?serverName=" + this.serverName);
    let json = await response.json();

    if(json.started === true) await this.send(cords.x, cords.y);
    else alert("game not started yet");
  }

  async send(x: number, y: number) {
    let cords = {x: x, y: y, playerName: this.playerName, serverName: this.serverName};

    let response = await fetch("/postGuessFieldCords", {
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
      alert("du bist nicht dran")
    }

  }

  async setPlayField() {
    let response = await fetch("/getGuessField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

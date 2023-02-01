import {Component, Input, OnInit} from '@angular/core';
import {createEmptyField, FeldState} from "../../../../Server";

@Component({
  selector: 'app-guess-play-field',
  templateUrl: './guess-play-field.component.html',
  styleUrls: ['./guess-play-field.component.css']
})
export class GuessPlayFieldComponent implements OnInit{
  ngOnInit(): void {
      this.playField = createEmptyField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";
  playField: FeldState[][] = []

  async setField(cords: { x: number; y: number }) {
    await this.send(cords.x, cords.y);
  }

  async send(x: number, y: number) {
    let cords = {x: x, y: y, playerName: this.playerName, serverName: this.serverName};

    await fetch("http://localhost:3000/postCords", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(cords)
    });

    await this.setPlayField();
  }

  async setPlayField() {
    let response = await fetch("http://localhost:3000/getGuessField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

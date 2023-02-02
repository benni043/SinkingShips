import {Component, Input, OnInit} from '@angular/core';
import {FeldState} from "../../../../Server";

@Component({
  selector: 'app-start-play-field',
  templateUrl: './start-play-field.component.html',
  styleUrls: ['./start-play-field.component.css']
})
export class StartPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    let login = {serverName: this.serverName, playerName: this.playerName}

    await fetch("http://localhost:3000/addPlayer", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(login)
    });

    await this.setPlayField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";
  playField: FeldState[][] = [];
  clicked: boolean = false;

  setField(cords: { x: number; y: number }) {
    this.playField[cords.x][cords.y] = FeldState.ship;
  }

  async send() {
    this.clicked = true;

    let playField = {field: this.playField, name: this.playerName, server: this.serverName};

    await fetch("http://localhost:3000/postField", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(playField)
    });
  }

  async setPlayField() {
    let response = await fetch("http://localhost:3000/getField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

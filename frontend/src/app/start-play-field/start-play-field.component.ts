import {Component, Input, OnInit} from '@angular/core';
import {FeldState} from "../../../../Server";
import {interval} from "rxjs";

@Component({
  selector: 'app-start-play-field',
  templateUrl: './start-play-field.component.html',
  styleUrls: ['./start-play-field.component.css']
})
export class StartPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
    let response = await fetch("/getPlayer?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();
    if(json.player.fieldSent) this.clicked = true;

    await this.setPlayField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";
  playField: FeldState[][] = [];
  clicked: boolean = false;

  setField(cords: { x: number; y: number }) {
    if(!this.clicked) this.playField[cords.x][cords.y] = FeldState.ship;
  }

  async send() {
    this.clicked = true;

    let playField = {field: this.playField, name: this.playerName, server: this.serverName};

    await fetch("/postField", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(playField)
    });

    setInterval(async () => {
      await this.setPlayField()
    }, 100)
  }

  async setPlayField() {
    let response = await fetch("/getField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    this.playField = json.field;
  }

}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Feld, FeldState} from "../../../../Server";

@Component({
  selector: 'app-start-play-field',
  templateUrl: './start-play-field.component.html',
  styleUrls: ['./start-play-field.component.css']
})
export class StartPlayFieldComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  async ngOnInit(): Promise<void> {
    let response = await fetch("/getPlayer?playerName=" + this.playerName + "&serverName=" + this.serverName);
    let json = await response.json();

    if (json.player.fieldSent) this.clicked = true;

    await this.setPlayField();
  }

  @Input() serverName: string = "";
  @Input() playerName: string = "";

  @Input() gameEnd: boolean = false;
  playField: Feld = [];
  clicked: boolean = false;
  interval: any;

  xCord: number = 0;
  yCord: number = 0;

  setField(cords: { x: number; y: number }) {
    if (!this.clicked) {
      this.xCord = cords.x
      this.yCord = cords.y

      if (this.playField[cords.x][cords.y].state === FeldState.ship) {
        this.playField[cords.x][cords.y].state = FeldState.empty;
      } else {
        this.playField[cords.x][cords.y].state = FeldState.ship;
      }
    }
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

    this.interval = setInterval(async () => {
      await this.setPlayField()
    }, 100)
  }

  async setPlayField() {
    let response = await fetch("/getField?playerName=" + this.playerName + "," + this.serverName);
    let json = await response.json();

    if (json.field !== undefined) this.playField = json.field;
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-start-play-field',
  templateUrl: './start-play-field.component.html',
  styleUrls: ['./start-play-field.component.css']
})
export class StartPlayFieldComponent implements OnInit{
  async ngOnInit(): Promise<void> {
      await this.setPlayField()
  }

  @Input() playerName: string = "";
  playField: string[][] =
    [
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
    ];

  setField(cords: { x: number; y: number }) {
    this.playField[cords.x][cords.y] = "X";
  }

  async send() {
    let playField = {field: this.playField, name: this.playerName};

    await fetch("http://localhost:3000/postField", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(playField)
    });
  }

  async setPlayField() {
    let response = await fetch("http://localhost:3000/getField?playerName=" + this.playerName);
    let json = await response.json();

    this.playField = json.field;
  }

}

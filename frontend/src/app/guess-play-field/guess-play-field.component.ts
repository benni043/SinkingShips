import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-guess-play-field',
  templateUrl: './guess-play-field.component.html',
  styleUrls: ['./guess-play-field.component.css']
})
export class GuessPlayFieldComponent {

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

  async setField(cords: { x: number; y: number }) {
    await this.send(cords.x, cords.y);
  }

  async send(x: number, y: number) {
    let cords = {x: x, y: y, name: this.playerName};

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
    let response = await fetch("http://localhost:3000/getGuessField?playerName=" + this.playerName);
    let json = await response.json();

    this.playField = json.field;
  }

}

import {Component, Input, Output} from '@angular/core';

@Component({
  selector: 'app-play-field',
  templateUrl: './play-field.component.html',
  styleUrls: ['./play-field.component.css']
})
export class PlayFieldComponent {

  @Input() playerName: string = "Player1";
  playFieldTopNav: string[] = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  @Output() ownPlayField: string[][] =
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

  markCellByCords(event: Event, x: number, y: number) {
    let playFieldCell: string = this.ownPlayField[x][y];

    if(playFieldCell === "") this.ownPlayField[x][y] = "X";
    else this.ownPlayField[x][y] = "";
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Feld, FeldState} from "../../../../Server";

@Component({
  selector: 'app-display-grid',
  templateUrl: './display-grid.component.html',
  styleUrls: ['./display-grid.component.css']
})
export class DisplayGridComponent{

  playFieldTopNav: string[] = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  @Input() playField: Feld = []

  @Output() cords: EventEmitter<{x: number, y: number}> = new EventEmitter<{x: number, y: number}>();

  @Input() playerName: string = "";
  @Output() sendName: EventEmitter<string> = new EventEmitter<string>();

  @Input() hover: boolean = true;
  @Input() disabled: boolean = false;

  sendCord(x: number, y: number) {
    if(this.disabled) return;
    this.cords.emit({x: x, y: y});
  }

}

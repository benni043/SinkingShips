import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FeldState} from "../../../../Server";

@Component({
  selector: 'app-display-grid',
  templateUrl: './display-grid.component.html',
  styleUrls: ['./display-grid.component.css']
})
export class DisplayGridComponent{

  playFieldTopNav: string[] = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  @Input() playField: FeldState[][] = []

  @Output() cords: EventEmitter<{x: number, y: number}> = new EventEmitter<{x: number, y: number}>();

  @Input() playerName: string = "";
  @Output() sendName: EventEmitter<string> = new EventEmitter<string>();

  sendCord(x: number, y: number) {
    this.cords.emit({x: x, y: y});
  }

}

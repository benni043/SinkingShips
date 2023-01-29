import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() nameEvent: EventEmitter<string> = new EventEmitter<string>();
  name: string = "";

  emit() {
    this.nameEvent.emit(this.name);
  }
}

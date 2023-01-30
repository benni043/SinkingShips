import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = "";
  @Output() servername: EventEmitter<string> = new EventEmitter<string>();

  async send() {
    this.servername.emit(this.name);
  }
}

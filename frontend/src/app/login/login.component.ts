import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = "";
  server: string = "";

  @Output() login: EventEmitter<{playerName: string, serverName: string}> = new EventEmitter<{playerName: string, serverName: string}>();

  async send() {
    this.login.emit({playerName: this.name, serverName: this.server});
  }
}

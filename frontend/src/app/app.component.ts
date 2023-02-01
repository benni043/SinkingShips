import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  name: string = "";
  server: string = "";

  setPlayerObj($event: { playerName: string; serverName: string }) {
    this.name = $event.playerName;
    this.server = $event.serverName;
  }
}

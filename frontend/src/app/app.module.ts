import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import { DisplayGridComponent } from './display-grid/display-grid.component';
import { StartPlayFieldComponent } from './start-play-field/start-play-field.component';
import { GuessPlayFieldComponent } from './guess-play-field/guess-play-field.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DisplayGridComponent,
    StartPlayFieldComponent,
    GuessPlayFieldComponent
  ],
    imports: [
        BrowserModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

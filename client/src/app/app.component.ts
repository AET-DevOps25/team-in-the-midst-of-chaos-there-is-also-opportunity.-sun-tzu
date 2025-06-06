import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PlayButtonComponent } from "./play-button/play-button.component";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, PlayButtonComponent, ProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}

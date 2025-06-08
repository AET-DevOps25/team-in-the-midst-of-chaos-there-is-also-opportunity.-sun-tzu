import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, ProgressBarComponent, PlayButtonComponent } from './components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, PlayButtonComponent, ProgressBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}

import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { SessionService } from '@app/services/session.service';


@Component({
  selector: 'app-welcome-page',
  imports: [MatButtonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  router = inject(Router)
  sessionService = inject(SessionService)
  readonly isLoading = signal(false)

  onClick() {
    this.isLoading.set(true)
    this.router.navigate(['/player'])
  }

}

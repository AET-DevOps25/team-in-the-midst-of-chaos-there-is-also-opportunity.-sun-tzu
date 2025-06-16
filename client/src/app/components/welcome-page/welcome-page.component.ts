import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { InitializationService } from '@app/services';

import { getTakeUntilDestroyed } from '@app/take-until-destroyed';


@Component({
  selector: 'app-welcome-page',
  imports: [MatButtonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements OnInit {
  router = inject(Router)
  initService = inject(InitializationService)
  takeUntilDestroyed = getTakeUntilDestroyed()

  isClicked = signal(false)

  readonly enterApp = effect(() => {
    const isInitialized = this.initService.isInitialized()
    const isClicked = this.isClicked()

    if (isClicked && isInitialized) {
      this.router.navigate(['/player'])
    }
  })

  ngOnInit(): void {
    this.initService.initialize().pipe(
      this.takeUntilDestroyed()
    ).subscribe()
  }

}

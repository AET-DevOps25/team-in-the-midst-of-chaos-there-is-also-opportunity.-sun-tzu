import { Component, inject, OnInit } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { InitializationService } from '@app/services';


@Component({
  selector: 'app-initial-page',
  imports: [MatProgressSpinnerModule],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss'
})
export class InitialPageComponent {
  initService = inject(InitializationService)
  router = inject(Router)

  ngOnInit(): void {
    this.initService.initialize().subscribe(() => {
      // reload current page
      // because the app is now initialized, the url now matches their actual paths
      this.router.navigateByUrl(this.router.url, {onSameUrlNavigation: 'reload'})
    })
  }

}

import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SessionService } from '@app/services/session.service';
import { concatWith } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  sessionService = inject(SessionService)
  router = inject(Router)

  logout() {
    this.sessionService.destroySession().subscribe(() => this.router.navigate(['']))
  }

}

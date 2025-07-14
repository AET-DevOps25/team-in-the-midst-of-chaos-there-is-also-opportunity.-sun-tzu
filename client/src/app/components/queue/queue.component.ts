import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { QueueService } from '@app/services';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  // Declare the observable property here
  isHandset$: Observable<boolean>;

  constructor(
    public queueService: QueueService,
    private breakpointObserver: BreakpointObserver
  ) {
    // Initialize the property inside the constructor
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.queueService.updateNextAudios().subscribe();
  }

  closeQueue(): void {
    this.queueService.hideQueue();
  }
}

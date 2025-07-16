import { Component, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
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
    MatButtonModule,
    NgStyle
  ],
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {

  // Re-using the same color palettes for consistency
  private bgColorPalette: string[] = ['#e0e7ff', '#f3e8ff', '#fce7f3'];
  private textColorPalette: string[] = ['#4338ca', '#9333ea', '#db2777'];
  isHandset$: Observable<boolean>;

  constructor(
    public queueService: QueueService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.queueService.updateNextAudios().subscribe();
  }

  getSongLogo(title: string): { initials: string, bgColor: string, color: string } {
    if (!title) {
      return { initials: '?', bgColor: '#e5e7eb', color: '#4b5563' };
    }
    const initials = title.substring(0, 2).toUpperCase();
    const lastCharCode = title.charCodeAt(title.length - 1);
    const colorIndex = lastCharCode % this.bgColorPalette.length;
    const bgColor = this.bgColorPalette[colorIndex];
    const color = this.textColorPalette[colorIndex];
    return { initials, bgColor, color };
  }

  closeQueue(): void {
    this.queueService.hideQueue();
  }
}

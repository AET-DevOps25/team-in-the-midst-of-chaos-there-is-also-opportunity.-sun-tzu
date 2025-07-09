import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { QueueService } from '@app/services/queue.service';

@Component({
  selector: 'app-queue',
  imports: [MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss'
})
export class QueueComponent implements OnInit {
  queueService = inject(QueueService)

  ngOnInit(): void {
    const sub = this.queueService.updateNextAudios().subscribe()
  }
}

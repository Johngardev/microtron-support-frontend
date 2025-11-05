import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../core/services/stats.service';
import { Stats } from '../../../core/models/stats.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  private statsService = inject(StatsService);
  stats$: Observable<Stats>;

  constructor() {
    this.stats$ = this.statsService.getAdminStats();
  }

}
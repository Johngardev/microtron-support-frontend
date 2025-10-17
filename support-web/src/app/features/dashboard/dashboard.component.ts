import { Component } from '@angular/core';
import { SummaryComponent } from "./components/summary/summary.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}

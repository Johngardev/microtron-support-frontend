import { Component, signal } from '@angular/core';
import { SummaryComponent } from "./components/summary/summary.component";
import { IncidentsComponent } from "./components/incidents/incidents.component";
import { SessionsComponent } from "./components/sessions/sessions.component";
import { MatListModule } from '@angular/material/list';

enum OptionType {
  Summary = 'summary',
  Incidents = 'incidents',
  Sessions = 'sessions'
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SummaryComponent, IncidentsComponent, SessionsComponent, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  optionTypes = OptionType;
  selectedOption = signal<OptionType>(OptionType.Summary);

  public setSelectedOption(option: OptionType) {
    this.selectedOption.set(option);
  }

  public getSelectedOption() {
    return this.selectedOption();
  }
}

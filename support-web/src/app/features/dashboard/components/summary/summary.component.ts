import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { CreateIncidentComponent } from './components/create-incident/create-incident.component';
import { HelpTopicComponent } from "../../../../shared/help-topic/help-topic.component";
import { MatTabsModule } from "@angular/material/tabs";
import { Manufacturer } from "../../../../core/models/help-topic.model";
import { HelpTopicService } from "../../../../core/services/help-topic.service";
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HelpTopicComponent, MatTabsModule, AsyncPipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  readonly createIncident = inject(MatDialog);
  private readonly helpTopicService = inject(HelpTopicService);

  public manufacturers!: Observable<Manufacturer[]>;

  ngOnInit(): void {
    this.manufacturers = this.helpTopicService.getManufacturers();
  }

  opendialog() {
    const dialogRef = this.createIncident.open(CreateIncidentComponent);
  }
  constructor() {}
}

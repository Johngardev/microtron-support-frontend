import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdobeTopicComponent } from "./components/adobe-topic/adobe-topic.component";
import { AnydeskTopicComponent } from "./components/anydesk-topic/anydesk-topic.component";
import { AutodeskTopicComponent } from "./components/autodesk-topic/autodesk-topic.component";
import { ClarisTopicComponent } from "./components/claris-topic/claris-topic.component";
import { CorelTopicComponent } from "./components/corel-topic/corel-topic.component";
import { GraphisoftTopicComponent } from "./components/graphisoft-topic/graphisoft-topic.component";
import { KasperskyTopicComponent } from "./components/kaspersky-topic/kaspersky-topic.component";
import { MicrosoftTopicComponent } from "./components/microsoft-topic/microsoft-topic.component";
import { PanoptoTopicComponent } from "./components/panopto-topic/panopto-topic.component";
import { AtlastiTopicComponent } from "./components/atlasti-topic/atlasti-topic.component";
import { SketchupTopicComponent } from "./components/sketchup-topic/sketchup-topic.component";
import { StarlabTopicComponent } from "./components/starlab-topic/starlab-topic.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateIncidentComponent } from './components/create-incident/create-incident.component';

enum CompanyType {
  Adobe = 'adobe',
  Anydesk = 'anydesk',
  Atlasti = 'atlasti',
  Autodesk = 'autodesk',
  Claris = 'claris',
  Corel = 'corel',
  Graphisoft = 'graphisoft',
  Kaspersky = 'kaspersky',
  Microsoft = 'microsoft',
  Panopto = 'panopto',
  Sketchup = 'sketchup',
  Starlab = 'starlab'
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, AdobeTopicComponent, AnydeskTopicComponent, AutodeskTopicComponent, ClarisTopicComponent, CorelTopicComponent, GraphisoftTopicComponent, KasperskyTopicComponent, MicrosoftTopicComponent, PanoptoTopicComponent, AtlastiTopicComponent, SketchupTopicComponent, StarlabTopicComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  companyTypes = CompanyType;
  selectedCompanyType = signal<CompanyType>(CompanyType.Adobe);
  readonly createIncident = inject(MatDialog);

  public setSelectedCompanyType(company: CompanyType) {
    this.selectedCompanyType.set(company);
  }

  public getSelectedCompanyType() {
    return this.selectedCompanyType();
  }

  opendialog() {
    const dialogRef = this.createIncident.open(CreateIncidentComponent);
  }
}

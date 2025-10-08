import { Component, Input } from '@angular/core';
import { HelpTopic } from '../../features/dashboard/components/summary/summary.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-help-topic',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './help-topic.component.html',
  styleUrl: './help-topic.component.css'
})
export class HelpTopicComponent {
  @Input() topics: HelpTopic[] = [];

}

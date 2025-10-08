import { Component, Input } from '@angular/core';
import { HelpTopic } from '../../features/dashboard/components/summary/summary.component';

@Component({
  selector: 'app-help-topic',
  standalone: true,
  imports: [],
  templateUrl: './help-topic.component.html',
  styleUrl: './help-topic.component.css'
})
export class HelpTopicComponent {
  @Input() topics: HelpTopic[] = [];

}

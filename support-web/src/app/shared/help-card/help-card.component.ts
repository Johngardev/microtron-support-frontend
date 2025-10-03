import { Component, Input } from '@angular/core';
import { HelpCard, HelpLink } from '../../core/models/help-card.model';

@Component({
  selector: 'app-help-card',
  standalone: true,
  imports: [],
  templateUrl: './help-card.component.html',
  styleUrl: './help-card.component.css'
})
export class HelpCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() links: HelpLink[] | undefined;

  @Input() set card(value: HelpCard) {
    this.title = value.title;
    this.description = value.description ?? '';
    this.links = value.links;
  }
}

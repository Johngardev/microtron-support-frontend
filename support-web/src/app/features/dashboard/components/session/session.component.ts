import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../../core/models/session.model';
import { SessionService } from '../../../../core/services/session.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [MatTabsModule, MatFormFieldModule, MatInputModule, DatePipe, RouterLink, NgClass],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent {
  session: Session | undefined;

  constructor(
    private _sessionService: SessionService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._sessionService.getSessionById(id).subscribe(data => {
        this.session = data;
      });
    }
  }
}

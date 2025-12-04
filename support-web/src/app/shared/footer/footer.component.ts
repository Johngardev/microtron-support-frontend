import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDialogModule, MatDialogModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly currentYear: number = new Date().getFullYear();
  readonly _dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this._dialog.open(ContactComponent);
  }
}

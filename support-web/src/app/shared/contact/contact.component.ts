import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from "@angular/cdk/a11y";
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatDialogModule, MatDivider, MatFormFieldModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  
}

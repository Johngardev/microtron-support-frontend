import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [MatSliderModule, MatInputModule, FormsModule, CommonModule],
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.css'
})
export class RangeSliderComponent {
  // Objeto para almacenar el valor inicial y final del rango
  public timeRange = {
    start: 9,
    end: 17,
  };

  // Límites del slider
  minHour: number = 5;
  maxHour: number = 21;

  // Función para formatear el tooltip que aparece sobre los selectores
  formatLabel(value: number): string {
    return `${value}`;
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-helpful-label',
  standalone: true,
  imports: [],
  templateUrl: './helpful-label.component.html',
  styleUrl: './helpful-label.component.scss',
})
export class HelpfulLabelComponent {
  @Input()
  label = "";

  @Input()
  for = "";
  }

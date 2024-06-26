// angular stuff
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-template',
  standalone: true,
  imports: [],
  templateUrl: './error-template.component.html',
  styleUrl: './error-template.component.scss',
})
export class ErrorTemplateComponent {
  @Input({ alias: 'errorType', required: true }) type: string = 'photos';
}

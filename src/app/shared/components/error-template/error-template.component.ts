import { JsonPipe } from '@angular/common';
import { Component, effect, Input, input } from '@angular/core';
import { ErrorResponse } from 'pexels';

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

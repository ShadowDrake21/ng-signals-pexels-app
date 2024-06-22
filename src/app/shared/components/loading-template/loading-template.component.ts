import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-template',
  standalone: true,
  imports: [],
  templateUrl: './loading-template.component.html',
  styleUrl: './loading-template.component.scss',
})
export class LoadingTemplateComponent {
  @Input({ required: true }) type!: 'page' | 'search';
}

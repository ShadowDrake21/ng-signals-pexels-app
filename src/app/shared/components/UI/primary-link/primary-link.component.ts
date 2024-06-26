// angular stuff
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-primary-link',
  standalone: true,
  imports: [],
  templateUrl: './primary-link.component.html',
  styleUrl: './primary-link.component.scss',
})
export class PrimaryLinkComponent {
  @Input({ required: true }) path: string = '';
  @Input({ required: true }) text: string = '';
}

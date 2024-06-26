// angular stuff
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-start-searching',
  standalone: true,
  imports: [],
  templateUrl: './start-searching.component.html',
  styleUrl: './start-searching.component.scss',
})
export class StartSearchingComponent {
  @Input({ required: true }) imgSrc!: string;
}

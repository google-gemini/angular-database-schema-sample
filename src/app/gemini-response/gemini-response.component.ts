import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, viewChild } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { LogService } from '../log.service';
import { HelpfulLabelComponent } from '../helpful-label/helpful-label.component';

@Component({
  selector: 'app-gemini-response',
  standalone: true,
  imports: [HelpfulLabelComponent],
  templateUrl: './gemini-response.component.html',
  styleUrl: './gemini-response.component.scss'
})
export class GeminiResponseComponent implements AfterViewChecked {
  protected scrollAnchor = viewChild.required<ElementRef<HTMLDivElement>>('scrollAnchor');

  constructor(
    private log: LogService,
    protected gemini: GeminiService,
  ) { }

  scrolled = false;

  ngAfterViewChecked(): void {
    if (!this.gemini.lastResponse || this.gemini.lastResponse.type == "none") {
      return;
    }

    if (this.scrolled) {
      // Only scroll into view once.
      return;
    }

    console.log('scroll')
    this.scrollAnchor().nativeElement.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    this.scrolled = true;
  }
}

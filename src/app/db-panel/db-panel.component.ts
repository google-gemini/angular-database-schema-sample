import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { GeminiService } from '../gemini.service';
import { LogService } from '../log.service';
import { HelpfulLabelComponent } from '../helpful-label/helpful-label.component';

@Component({
  selector: 'app-db-panel',
  standalone: true,
  imports: [HelpfulLabelComponent],
  templateUrl: './db-panel.component.html',
  styleUrl: './db-panel.component.css'
})
export class DbPanelComponent {

  // True while waiting for Gemini API response.
  protected waiting = false;

  constructor(
    private log: LogService,
    protected gemini: GeminiService,
    protected database: DatabaseService,
  ) { }

  send(prompt: string) {
    if (this.waiting) {
      this.log.warn("Unable to send, still waiting for response." +
        " Reload page to restart."
      );
      // Prevent form submission.
      return false;
    }
    if (!prompt) {
      this.log.warn("Prompt is empty. Nothing to send.");
      // Prevent form submission.
      return false;
    }

    // Async call.
    this.generateResponse(prompt);

    // Prevent form submission.
    return false;
  }

  async generateResponse(prompt: string) {
    this.waiting = true;
    try {
      await this.gemini.generateResponse(prompt);
    } catch (e) {
      this.log.catch(e);
    } finally {
      this.waiting = false;
    }
  }
}
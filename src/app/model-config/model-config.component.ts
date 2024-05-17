import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { LogService } from '../log.service';
import { GeminiService } from '../gemini.service';
import { HelpfulLabelComponent } from '../helpful-label/helpful-label.component';

@Component({
  selector: 'app-model-config',
  templateUrl: './model-config.component.html',
  styleUrl: './model-config.component.css',
  standalone: true,
  imports: [HelpfulLabelComponent]
})
export class ModelConfigComponent implements OnInit {
  protected modelVersion = viewChild.required<ElementRef<HTMLInputElement>>('modelVersion');
  protected apiKey = viewChild.required<ElementRef<HTMLInputElement>>('apiKey');

  constructor(
    private log: LogService,
    protected gemini: GeminiService,
  ) { }

  // https://ai.google.dev/gemini-api/docs/models/gemini#model-versions
  defaultModelVersion = "gemini-1.5-flash-latest";

  systemInstruction = `You are an AI database agent.

  1. Users describe what data they would like to store in plain language.
  
  2. You translate these descriptions into a suitable database schema.
     - Consider the tables, columns and data types that would be appropriate.
     - Expand the set of obvious columns to be added to include columns that
       are also likely to exist in production databases.
  
  3. Compare the current schema with the new schema.
     - Review the existing tables and columns in the current schema.
     - Ensure columns data types are still appropriate in the new schema.
     - Determine whether any tables and/or columns are missing.
     - Identify which columns need to moved to different tables.
     
  4. Respond with multiple function calls to fully update the schema.
     - Create all missing tables.
     - Alter existing tables to add missing columns.
     - Delete columns that have been moved to another table.

For example, if the user asks to create a library management system with books,
authors, members, and loans, return 4 tables: one each for books, authors,
members, and loans.`;

  ngOnInit(): void {
    // Set initial values that are hard-coded in the HTML.
    this.configure();
  }

  configure() {
    const modelVersion = this.modelVersion().nativeElement.value;
    const apiKey = this.apiKey().nativeElement.value
    if (modelVersion && apiKey) {
      this.gemini.configure(modelVersion, apiKey);
    }
  }

  setSystemInstruction(systemInstruction: string) {
    this.gemini.setSystemInstruction(systemInstruction);
  }

}

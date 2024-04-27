import { Component } from '@angular/core';
import { LogService } from '../log.service';
import { DatabaseService } from '../database.service';
import { HelpfulLabelComponent } from '../helpful-label/helpful-label.component';

@Component({
  selector: 'app-db-schema',
  standalone: true,
  imports: [HelpfulLabelComponent],
  templateUrl: './db-schema.component.html',
  styleUrl: './db-schema.component.css'
})
export class DbSchemaComponent {

  constructor(
    private log: LogService,
    protected database: DatabaseService,
  ) { }

}

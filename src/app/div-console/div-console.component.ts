// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, ElementRef, viewChild } from '@angular/core';
import { LogService } from '../log.service';
import { UpperCasePipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-div-console',
    standalone: true,
    templateUrl: './div-console.component.html',
    styleUrl: './div-console.component.scss',
    imports: [UpperCasePipe, DatePipe],
})
export class DivConsoleComponent {

  protected scrollAnchor = viewChild.required<ElementRef<HTMLDivElement>>('scrollAnchor');

  // Whether the console is expanded.
  protected expanded = false;

  constructor(
    public log: LogService
  ) { }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      setTimeout(() => this.scrollToEnd(), 1);
    }
  }

  scrollToEnd() {
    this.scrollAnchor().nativeElement.scrollIntoView();
  }

  clear() {
    this.log.logMessages = [];
  }
}

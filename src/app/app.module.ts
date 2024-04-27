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

import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DbPanelComponent } from './db-panel/db-panel.component';
import { DbTableComponent } from './db-table/db-table.component';
import { DivConsoleComponent } from './div-console/div-console.component';
import { ErrorHandlerModule } from './error-handler/error-handler.module';
import { ModelConfigComponent } from './model-config/model-config.component';
import { GeminiResponseComponent } from './gemini-response/gemini-response.component';
import { DbSchemaComponent } from './db-schema/db-schema.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    DbPanelComponent,
    DbSchemaComponent,
    DbTableComponent,
    DivConsoleComponent,
    GeminiResponseComponent,
    ModelConfigComponent,
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerModule }, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule { }

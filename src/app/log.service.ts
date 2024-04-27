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

import { Injectable } from '@angular/core';

enum Level {
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
}

interface LogMessage {
  level: Level;
  datetime: Date;
  message?: string;
  error?: Error;
};

@Injectable({
  providedIn: 'root'
})
export class LogService {

  logMessages: LogMessage[] = [];

  constructor() { }

  totext(...args: any[]): string {
    return args.reduce((prev: any, curr: any, i: number, arr: any[]) => {
      prev = prev ? prev + " " : "";
      switch (typeof curr) {
        case "string":
          prev += curr;
          break;
        default:
          prev += JSON.stringify(curr, null, 2)
          break;
      }
      return prev;
    });
  }

  debug(...args: any[]) {
    console.debug(...args);
    this.logMessages.push({ level: Level.debug, datetime: new Date(), message: this.totext(...args), error: undefined });
  }

  info(...args: any[]) {
    console.info(...args);
    this.logMessages.push({ level: Level.info, datetime: new Date(), message: this.totext(...args), error: undefined });
  }

  warn(...args: any[]) {
    console.warn(...args);
    this.logMessages.push({ level: Level.warn, datetime: new Date(), message: this.totext(...args), error: undefined });
  }

  error(...args: any[]) {
    console.error(...args);
    this.logMessages.push({ level: Level.error, datetime: new Date(), message: this.totext(...args), error: undefined });
  }

  catch(err: any) {
    if (err instanceof Error) {
      this.handle(err as Error);
    } else {
      console.error(err);
      this.logMessages.push({ level: Level.error, datetime: new Date(), message: undefined, error: new Error("Caught", { cause: err }) });
    }
  }

  handle(err: Error) {
    console.error("Uncaught exception", err);
    this.logMessages.push({ level: Level.error, datetime: new Date(), message: "Uncaught exception", error: err });
  }

}

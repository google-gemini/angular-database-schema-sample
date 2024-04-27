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

import { Injectable } from "@angular/core";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { DatabaseService } from "./database.service";
import { functionDeclarations } from "./gemini-function-declarations";
import { LogService } from "./log.service";

type ResponseType = "none" | "waiting" | "unknown" | "functionCalls" | "invalidFunctionCalls" | "text" | "error";

type Response = {
  type: ResponseType,
  response?: string,
};

@Injectable({
  providedIn: "root"
})
export class GeminiService {

  constructor(
    private log: LogService,
    private database: DatabaseService,
  ) { }

  model!: GenerativeModel;

  systemInstruction = "";

  // Most recent response.
  public lastResponse: Response = { type: "none" };

  setSystemInstruction(systemInstruction: string) {
    this.systemInstruction = systemInstruction;
  }

  configure(modelVersion: string, apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: modelVersion });
  }

  async generateResponse(prompt: string) {
    if (!this.model) {
      this.lastResponse = {
        type: "error",
        response: 'You must specify a model name and valid API Key.',
      };
      return;
    }

    try {
      this.lastResponse = { type: "waiting" };

      this.model.tools = [{
        functionDeclarations: functionDeclarations,
      }];

      this.model.toolConfig = {
        functionCallingConfig: {
          // Require function calling response.
          // mode: FunctionCallingMode.ANY,
          // allowedFunctionNames: ["createTable", "alterTable"],
        }
      };

      if (this.systemInstruction) {
        this.model.systemInstruction = {
          role: "user",
          parts: [{ text: this.systemInstruction }],
        };
      }

      prompt = prompt + "\nCurrent database schema:\n" +
        (this.database.tables.length ?
          JSON.stringify(this.database.tables)
          : "None, the database does not contain any table definitions.");
      this.log.info("Sending prompt:\n-----\n" + prompt + "\n-----");
      const result = await this.model.generateContent(prompt);

      const calls = result.response.functionCalls();
      if (calls) {
        this.log.info("Received", calls.length, "function calls.");
        const success = calls.every((fc, i) => {
          this.log.info("Received function call response:", fc);
          const err = this.database.callFunction(fc);
          if (err) {
            this.log.error("Error calling function: " + fc.name, err);
            return false;
          }
          this.log.info("Successfully called function " + fc.name);
          return true;
        });
        this.lastResponse = {
          type: success ? "functionCalls" : "invalidFunctionCalls",
          response: JSON.stringify(calls, null, 2),
        };
      } else if (result.response.text()) {
        this.log.info("Received text response:", result.response.text());
        this.lastResponse = {
          type: "text",
          response: result.response.text(),
        };
      } else {
        this.lastResponse = {
          type: "unknown",
          response: JSON.stringify(result.response),
        }
      }
    } catch (e) {
      this.lastResponse = {
        type: "error",
        response: '' + e,
      }
      // Rethrow.
      throw e;
    }
  }
}

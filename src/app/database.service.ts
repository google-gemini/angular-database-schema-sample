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
import { LogService } from './log.service';
import { FunctionCall } from '@google/generative-ai';

export const ColumnTypeValues = ['string', 'integer', 'date'] as const;
type ColumnType = typeof ColumnTypeValues[number];

type Column = {
  columnName: string,
  columnType: ColumnType,
};

export type Table = {
  tableName: string,
  columns: Column[],
};

interface DatabaseFunction {
  (log: LogService, ...args: any[]): boolean;
}

interface DatabaseFunctions {
  [fname: string]: DatabaseFunction
};

interface alterTableArgs {
  tableName: string,
  addColumns: Column[],
  removeColumns: Column[],
  alterColumns: Column[],
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private log: LogService,
  ) { }

  tables: Table[] = [];

  createTable(log: LogService, table: Table) {
    log.info("Creating table", table);
    this.tables.push(table);
  }

  getOrMakeTable(tableName: string): Table {
    return this.tables.find(t => t.tableName == tableName) || {} as Table;
  }

  alterTable(log: LogService, args: alterTableArgs) {
    log.info("Altering table", args);
    const table = this.getOrMakeTable(args.tableName);

    // Remove specified columns.
    if (args.removeColumns) {
      args.removeColumns.forEach(col => {
        const i = table.columns.findIndex(c => c.columnName == col.columnName);
        if (i == -1) {
          this.log.warn("ALTER TABLE", table.tableName, "FAILED TO DELETE NON-EXISTENT COLUMN", col.columnName);
        } else {
          this.log.debug("ALTER TABLE", table.tableName, "DELETE COLUMN", col.columnName);
          table.columns.splice(i, 1);
        }
      });
    }

    // Alter existing columns.
    if (args.alterColumns) {
      args.alterColumns.forEach(col => {
        const c = table.columns.find(c => c.columnName == col.columnName);
        if (c) {
          this.log.debug("ALTER TABLE", args.tableName, "MODIFY COLUMN", col.columnName, "MODIFY TYPE", col.columnType, "->", c.columnType);
          c.columnType = col.columnType;
        }
      });
    }

    // Add new columns.
    if (args.addColumns) {
      args.addColumns.forEach(col => {
        this.log.debug("ALTER TABLE", args.tableName, "ADD COLUMN", col.columnName, "TYPE", col.columnType);
        table.columns.push(col);
      });
    }
  }

  dbfunctions: { [functionName: string]: Function } = {
    createTable: this.createTable,
    alterTable: this.alterTable,
  };

  callFunction(fc: FunctionCall) : Error | undefined {
    const f = this.dbfunctions[fc.name];
    if (!f) {
      return Error("Model requested call to non-existant function: " + fc.name);
    }
    try {
      f.apply(this, [this.log, fc.args]);
      return undefined;
    } catch(e) {
      return Error("Failed to call requested funciton " + fc.name, {cause: e});
    }
  }
}

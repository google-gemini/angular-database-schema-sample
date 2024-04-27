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

import { FunctionDeclaration, FunctionDeclarationSchema, FunctionDeclarationSchemaProperty, FunctionDeclarationSchemaType } from "@google/generative-ai";
import { ColumnTypeValues } from "./database.service";

const tableNameSchema: FunctionDeclarationSchemaProperty = {
    type: FunctionDeclarationSchemaType.STRING,
    nullable: false,
    description:
        "Table name. Table names should be lowercase, and use snake_case.",
};
const columnNameSchema: FunctionDeclarationSchemaProperty = {
    type: FunctionDeclarationSchemaType.STRING,
    nullable: false,
    description:
        "Column name. Column names should be lowercase, and use snake_case.",
};

const columnTypeSchema: FunctionDeclarationSchemaProperty = {
    type: FunctionDeclarationSchemaType.STRING,
    nullable: false,
    enum: [...ColumnTypeValues],
    description:
        "Column type. Specifies the type of data that can be stored in this column.",
};

const tableColumnProperties: { [k: string]: FunctionDeclarationSchemaProperty } = {
    columnName: columnNameSchema,
    columnType: columnTypeSchema,
};

const columnSchema: FunctionDeclarationSchema = {
    type: FunctionDeclarationSchemaType.OBJECT,
    description: "Table column. Specifies the properties of a table column.",
    properties: tableColumnProperties,
    required: ["columnName, columnType"],
};

const columnsSchema: FunctionDeclarationSchemaProperty = {
    type: FunctionDeclarationSchemaType.ARRAY,
    nullable: false,
    description: "Array of table columns definitions.",
    items: columnSchema,
};

const createTableSchema: { [k: string]: FunctionDeclarationSchemaProperty } = {
    tableName: tableNameSchema,
    columns: columnsSchema,
};

const aterTableSchema: { [k: string]: FunctionDeclarationSchemaProperty } = {
    tableName: tableNameSchema,
    addColumns: columnsSchema,
    removeColumns: columnsSchema,
    alterColumns: columnsSchema,
};

const createTableFunctionDeclaration: FunctionDeclaration = {
    name: "createTable",
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        description: "Create database table.",
        properties: createTableSchema,
        required: ["tableName", "columns"],
    },
};

const alterTableFunctionDeclaration: FunctionDeclaration = {
    name: "alterTable",
    parameters: {
        type: FunctionDeclarationSchemaType.OBJECT,
        description: "Alter database table. Modifies column definitions.",
        properties: aterTableSchema,
        required: ["tableName"],
    },
};

export const functionDeclarations = [
    createTableFunctionDeclaration,
    alterTableFunctionDeclaration,
];
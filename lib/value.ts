export type Column = {
  name: string;
  dataType: DataType;
  sampleData?: string;
};

export const defaultValue: Column = { name: "", dataType: "VARCHAR" };

export const dataTypes = [
  "INT",
  "TINYINT",
  "SMALLINT",
  "MEDIUMINT",
  "BIGINT",
  "FLOAT",
  "DOUBLE",
  "DECIMAL",
  "CHAR",
  "VARCHAR",
  "TEXT",
  "BLOB",
  "DATE",
  "TIME",
  "DATETIME",
  "TIMESTAMP",
  "BOOLEAN",
  "ENUM",
  "SET",
] as const;

export type DataType = (typeof dataTypes)[number];

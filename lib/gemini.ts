"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Column } from "./value";

export const GetDataFromGemini = async (
  tableName: string,
  columns: Column[]
) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined");
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = CreatePromptText(tableName, columns);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

const CreatePromptText = (tableName: string, data: Column[]) => {
  let prompt =
    "Create a hundred records of the following data in CSV format:\n";
  prompt += `table_name: ${tableName}\n`;
  const columns: string[] = data.map((item) => {
    return `column1: ${item.name}, dataType: ${item.dataType}`;
  });

  prompt += columns.join("\n");
  return prompt;
};

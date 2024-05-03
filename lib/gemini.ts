"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Column } from "./value";

export const GetDataFromGemini = async (data: Column[]) => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined");
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = CreatePromptText(data);
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

const CreatePromptText = (data: Column[]) => {
  let prompt = "Create a hundred records of the following data in CSV format:";
  const columns: string[] = data.map((item) => {
    return `column1: ${item.name}, dataType: ${item.dataType}`;
  });

  prompt += columns.join("\n");
  return prompt;
};

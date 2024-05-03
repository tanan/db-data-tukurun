"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DatabaseSchemaForm from "./_components/form";

export default function Home() {
  return (
    <main>
      <DatabaseSchemaForm />
    </main>
  );
}

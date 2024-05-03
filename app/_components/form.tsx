"use client";

import { Box, Button, Stack, TextField, MenuItem } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Column, dataTypes, defaultValue } from "../../lib/value";
import { GetDataFromGemini } from "@/lib/gemini";
import { useState } from "react";

const DatabaseSchemaForm = () => {
  const [data, setData] = useState("");
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type FormValues = {
    columns: Column[];
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      columns: [defaultValue],
    },
  });

  const { fields, insert, remove, move } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const text = await GetDataFromGemini(data.columns);
    setData(text);
    setShowData(true);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const validationRules = {
    name: {
      required: "Name is required",
    },
  };

  const MAXIMUM_FIELDS = 10;

  return (
    <>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <Stack
              key={field.id}
              direction={"row"}
              spacing={1}
              my={1}
              justifyContent={"center"}
            >
              <Controller
                name={`columns.${index}.name`}
                control={control}
                rules={validationRules.name}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={"name"}
                    placeholder={"name"}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    size="small"
                  />
                )}
              />

              <Controller
                name={`columns.${index}.dataType`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="dataType"
                    label="dataType"
                    select
                    size="small"
                  >
                    {dataTypes.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Button
                variant="contained"
                onClick={() => insert(index + 1, defaultValue)}
                disabled={fields.length >= MAXIMUM_FIELDS}
              >
                追加
              </Button>

              <Button
                variant="outlined"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                削除
              </Button>

              <Button
                variant="contained"
                onClick={() => move(index, index + 1)}
                disabled={fields.length <= index + 1}
              >
                ↓
              </Button>

              <Button
                variant="contained"
                onClick={() => move(index, index - 1)}
                disabled={!index}
              >
                ↑
              </Button>
            </Stack>
          );
        })}

        <Stack
          direction={"row"}
          spacing={1}
          className="mx-auto"
          my={3}
          justifyContent={"center"}
        >
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
            className="md:w-24"
          >
            {isLoading ? "送信中..." : "送信"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => reset()}
            className="md:w-24"
          >
            リセット
          </Button>
        </Stack>
      </Box>
      <div hidden={!showData}>
        <Button variant="outlined" onClick={handleDownload} className="md:w-30">
          ダウンロード
        </Button>
      </div>
    </>
  );
};

export default DatabaseSchemaForm;

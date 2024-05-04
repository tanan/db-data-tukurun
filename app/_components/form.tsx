"use client";

import {
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  ThemeProvider,
  CssBaseline,
  Divider,
  CircularProgress,
} from "@mui/material";
import { GoFile, GoPlusCircle, GoTrash } from "react-icons/go";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Column, dataTypes, defaultValue } from "../../lib/value";
import { GetDataFromGemini } from "@/lib/gemini";
import { useState } from "react";
import theme from "@/lib/theme";

const DatabaseSchemaForm = () => {
  const [tableName, setTableName] = useState("");
  const [data, setData] = useState("");
  const [showData, setShowData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type FormValues = {
    tableName: string;
    columns: Column[];
  };

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      tableName: "",
      columns: [defaultValue],
    },
  });

  const { fields, insert, remove, move } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setTableName(data.tableName);
    const text = await GetDataFromGemini(data.tableName, data.columns);
    setData(text);
    setShowData(true);
    setIsLoading(false);
  };

  const validationRules = {
    name: {
      required: "Name is required",
    },
  };

  const MAXIMUM_FIELDS = 10;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className="my-8"
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack
          spacing={1}
          my={1}
          justifyContent={"center"}
          className="w-2/3 md:w-1/2 mx-auto"
        >
          <span className="text-md font-semibold">テーブル名</span>
          <Controller
            name={`tableName`}
            control={control}
            rules={validationRules.name}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={"name"}
                placeholder={"table_name"}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                size="small"
              />
            )}
          />
        </Stack>
        <Divider variant="middle" className="w-2/3 mx-auto my-8" />
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
                    sx={{
                      width: 120,
                    }}
                    InputProps={{
                      style: {
                        fontSize: 12,
                        paddingTop: 3.4,
                        paddingBottom: 3.4,
                      },
                    }}
                  >
                    {dataTypes.map((item, index) => (
                      <MenuItem
                        key={index}
                        value={item}
                        sx={{
                          fontSize: 12,
                        }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <div
                onClick={() => {
                  insert(index + 1, defaultValue);
                }}
                className="flex flex-row items-center justify-center cursor-pointer hover:opacity-60"
              >
                <GoPlusCircle size={24} />
              </div>

              <div
                onClick={() => remove(index)}
                className="flex flex-row items-center justify-center cursor-pointer hover:opacity-60"
              >
                <GoTrash size={24} />
              </div>

              {/* <Button
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
              </Button> */}
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
            {isLoading ? "作成中..." : "送信"}
          </Button>
        </Stack>
        {LoadingCircular(isLoading)}
        {FileDownloadLink(tableName, data, showData)}
      </Box>
    </ThemeProvider>
  );
};

const LoadingCircular = (isLoading: boolean) => {
  return (
    <>
      {isLoading && (
        <div className="flex justify-center">
          <CircularProgress size={30} />
        </div>
      )}
    </>
  );
};

const FileDownloadLink = (
  tableName: string,
  data: string,
  showData: boolean
) => {
  const handleDownload = () => {
    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <>
      {showData && (
        <div
          onClick={handleDownload}
          className="flex flex-row items-center justify-center mx-auto cursor-pointer hover:opacity-60"
        >
          <GoFile size={24} />
          <span className="mx-2 text-sm text-gray-600">{tableName}.csv</span>
        </div>
      )}
    </>
  );
};

export default DatabaseSchemaForm;

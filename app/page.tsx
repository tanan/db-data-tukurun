"use client";

import styles from "./page.module.css";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export default function Home() {
  type FormValues = {
    profile: {
      firstName: string;
      lastName: string;
    }[];
  };

  const defaultValue = { firstName: "", lastName: "" };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      profile: [defaultValue],
    },
  });

  const { fields, insert, remove, move } = useFieldArray({
    control,
    name: "profile",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data.profile);
  };

  const validationRules = {
    lastName: {
      required: "名字を入力してください",
      maxLength: {
        value: 10,
        message: "名字は10文字以内で入力してください",
      },
    },
    firstName: {
      required: "名前を入力してください",
      maxLength: {
        value: 10,
        message: "名前は10文字以内で入力してください",
      },
    },
  };

  const MAXIMUM_USER = 5;

  return (
    <main className={styles.main}>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <Stack key={field.id} direction={"row"} spacing={1} my={1}>
              <Controller
                name={`profile.${index}.firstName`}
                control={control}
                rules={validationRules.firstName}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder={"名前"}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name={`profile.${index}.lastName`}
                control={control}
                rules={validationRules.lastName}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    placeholder={"名字"}
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Button
                variant="contained"
                onClick={() => insert(index + 1, defaultValue)}
                disabled={fields.length >= MAXIMUM_USER}
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

        <Stack spacing={1}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            送信
          </Button>

          <Button variant="outlined" fullWidth onClick={() => reset()}>
            リセット
          </Button>
        </Stack>
      </Box>
    </main>
  );
}

import { Box, Button, Stack, TextField, MenuItem } from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Column, dataTypes, defaultValue } from "./value";

const DatabaseSchemaForm = () => {
  type FormValues = {
    column: Column[];
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      column: [defaultValue],
    },
  });

  const { fields, insert, remove, move } = useFieldArray({
    control,
    name: "column",
  });

  const onSubmit = (data: FormValues) => {
    console.log(data.column);
  };

  const validationRules = {
    name: {
      required: "Name is required",
    },
  };

  const MAXIMUM_FIELDS = 20;

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => {
        return (
          <Stack key={field.id} direction={"row"} spacing={1} my={1}>
            <Controller
              name={`column.${index}.name`}
              control={control}
              rules={validationRules.name}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  placeholder={"name"}
                  error={fieldState.invalid}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name={`column.${index}.dataType`}
              control={control}
              render={({ field }) => (
                <TextField {...field} id="dataType" label="dataType" select>
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
  );
};

export default DatabaseSchemaForm;

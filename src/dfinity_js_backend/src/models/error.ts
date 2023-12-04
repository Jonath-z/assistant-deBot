import { Record, text } from "azle";

export const ErrorResponse = Record({
  error: Record({
    message: text,
  }),
});

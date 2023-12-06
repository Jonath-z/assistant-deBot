import { Null, Opt, Record, nat64, text } from "azle";

export const SaveAssistantPayload = Record({
  id: text,
  name: text,
  description: Null || Opt(text),
  model: text,
  instructions: text,
});

export const Thread = Record({
  id: text,
  object: text,
  created_at: nat64,
});

export const CreateThead = Record({
  thread: Thread,
});

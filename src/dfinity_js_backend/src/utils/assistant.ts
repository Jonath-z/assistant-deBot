import { managementCanister } from "azle/canisters/management";
import {
  update,
  text,
  Record,
  Opt,
  ic,
  Vec,
  Ok,
  Err,
  Result,
  int64,
  Some,
  Principal,
} from "azle";
import { OPEN_AI_API_KEY } from "./credential";

export const ASSISTANT_ENDPOINT = "https://api.openai.com/v1/assistants";

const CreatAssiatantPayload = Record({
  model: text,
  name: text,
  description: Opt(text),
  instructions: text,
  tools: Vec(text),
});

const CreateAssistantResponseBody = Record({
  id: text,
  object: text,
  created_at: int64,
  name: text,
  description: text,
  model: text,
  instructions: text,
  tools: Vec(text),
  file_ids: Vec(text),
  metadata: Record({}),
});

export const createAssistant = () => {
  return {
    call: update(
      [CreatAssiatantPayload],
      Result(CreateAssistantResponseBody, text),
      async (payload) => {
        try {
          const fomattedPayload = {
            ...payload,
            tools: payload.tools.map((tool) => ({ type: tool })),
            description: payload.description?.Some ?? "",
          };

          const response = await ic.call(managementCanister.http_request, {
            args: [
              {
                transform: Some({
                  function: [ic.id(), "transform"] as [Principal, string],
                  context: Uint8Array.from([]),
                }),
                url: ASSISTANT_ENDPOINT,
                max_response_bytes: Some(2_000n),
                method: {
                  post: null,
                },
                body: Some(
                  Buffer.from(JSON.stringify(fomattedPayload), "utf-8")
                ),
                headers: [
                  {
                    name: "OpenAI-Beta",
                    value: "assistants=v1",
                  },
                  {
                    name: "Authorization",
                    value: `Bearer ${OPEN_AI_API_KEY}`,
                  },
                  {
                    name: "content-type",
                    value: "application/json",
                  },
                ],
              },
            ],
            cycles: 50_000_000n,
          });
          const formattedResponse = JSON.parse(
            Buffer.from(response.body.buffer).toString("utf-8")
          );

          return Ok({
            ...formattedResponse,
            tools: formattedResponse.tools.map((tool: any) => tool.type),
          });
        } catch (e) {
          console.log(e);
          return Err(JSON.stringify(e));
        }
      }
    ),
  };
};

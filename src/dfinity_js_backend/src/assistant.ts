import { managementCanister } from "azle/canisters/management";
import {
  update,
  text,
  ic,
  Vec,
  Ok,
  Err,
  Result,
  Some,
  Principal,
  StableBTreeMap,
  nat16,
  None,
  query,
} from "azle";
import { ErrorResponse } from "./models/error";
import { ASSISTANT_ENDPOINT } from "./utils/constants";
import { CreateAssistantResponseBody } from "./models/assistant";
import { OPEN_AI_API_KEY } from "../../../credential";

const assistantStorage = StableBTreeMap(
  text,
  Vec(CreateAssistantResponseBody),
  1
);

class Assistant {
  private saveUserAssistant(
    userIdentity: text,
    assistant: typeof CreateAssistantResponseBody
  ) {
    assistantStorage.insert(userIdentity, [assistant]);
  }

  private fromatCreateAssistantResponse(
    body: ArrayBufferLike,
    status: nat16
  ): typeof CreateAssistantResponseBody {
    const JSONResponse = JSON.parse(Buffer.from(body).toString("utf-8"));

    if (status !== 200) {
      return JSONResponse;
    }
    return {
      ...JSONResponse,
      tools: JSONResponse.tools.map((tool: any) => tool.type),
    };
  }

  /**
   * save user assistant function
   * @date 11/29/2023 - 11:38:18 AM
   *
   * @param {string} assistantId
   * @param {string} userIdentity
   * @returns {*}
   */
  saveAssistant() {
    return update(
      [text, text],
      Result(CreateAssistantResponseBody, ErrorResponse),
      async (assistantId, userIdentity) => {
        const response = await ic.call(managementCanister.http_request, {
          args: [
            {
              transform: Some({
                function: [ic.id(), "transform"] as [Principal, string],
                context: Uint8Array.from([]),
              }),
              url: `${ASSISTANT_ENDPOINT}/${assistantId.trim()}`,
              max_response_bytes: Some(2_000n),
              method: {
                get: null,
              },
              body: None,
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

        const formattedResponse = this.fromatCreateAssistantResponse(
          response.body.buffer,
          Number(response.status)
        );

        if (Number(response.status) !== 200) {
          return Err({
            error: {
              message: (formattedResponse as unknown as typeof ErrorResponse)
                .error.message,
            },
          });
        }

        this.saveUserAssistant(userIdentity, formattedResponse);
        return Ok(formattedResponse);
      }
    );
  }

  getUserAssistants() {
    return query(
      [text],
      Result(Vec(CreateAssistantResponseBody), ErrorResponse),
      async (userIdentity) => {
        if (!userIdentity) {
          return Err({ error: { message: "userIdentity can not be empty" } });
        }
        const assistants = assistantStorage.get(userIdentity);
        if ("None" in assistants) {
          return Err({
            error: { message: `No assistant found for ${userIdentity}` },
          });
        }
        return Ok(assistants.Some);
      }
    );
  }
}

const assistant = new Assistant();
export default assistant;

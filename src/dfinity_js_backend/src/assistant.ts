import {
  update,
  text,
  Vec,
  Ok,
  Err,
  Result,
  StableBTreeMap,
  nat16,
  query,
  bool,
} from "azle";
import { ErrorResponse } from "./models/error";
import { ASSISTANT_ENDPOINT, THREAD_ENDPOINT } from "./utils/constants";
import {
  CreateAssistantResponseBody,
  CreateThead,
  Thread,
} from "./models/assistant";
import { OPEN_AI_API_KEY } from "../../../credential";
import ICPFetch from "./utils/ICPFetch";

const assistantStorage = StableBTreeMap(
  text,
  Vec(CreateAssistantResponseBody),
  1
);

const threadStorage = StableBTreeMap(text, CreateThead, 4);

class Assistant {
  private saveUserAssistant(
    userIdentity: text,
    assistant: typeof CreateAssistantResponseBody
  ) {
    assistantStorage.insert(userIdentity, [assistant]);
  }

  saveAssistant() {
    return update(
      [text, text],
      Result(CreateAssistantResponseBody, ErrorResponse),
      async (assistantId, userIdentity) => {
        const { data, error } = await ICPFetch(
          `${ASSISTANT_ENDPOINT}/${assistantId.trim()}`,
          {
            method: "GET",
            transform: "transform",
            headers: {
              "OpenAI-Beta": "assistants=v1",
              Authorization: `Bearer ${OPEN_AI_API_KEY}`,
              "content-type": "application/json",
            },
          }
        );

        if (error.message) {
          return Err({
            error: {
              message: error.message,
            },
          });
        }

        const formattedResponse = {
          ...data,
          tools: data.tools.map((tool: any) => tool.type),
        };

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

  saveThread() {
    return update(
      [text, text],
      Result(Thread, ErrorResponse),
      async (userIdentity, assistantId) => {
        if (!userIdentity) {
          return Err({
            error: { message: "userIdentity and thread can not be empty" },
          });
        }
        // Support one thread for now, can add multiple threads support
        const hasASavedThread = this.hasASavedThread(userIdentity);
        if (hasASavedThread) {
          const thread = threadStorage.get(userIdentity.trim());
          return Ok(thread.Some.thread);
        }

        const { data, error } = await ICPFetch(THREAD_ENDPOINT, {
          method: "POST",
          transform: "threadTransform",
          headers: {
            "OpenAI-Beta": "assistants=v1",
            Authorization: `Bearer ${OPEN_AI_API_KEY}`,
            "content-type": "application/json",
          },
        });

        if (error.message) {
          return Err({
            error: { message: error.message },
          });
        }

        const threadToSave: typeof CreateThead = {
          assistantId,
          thread: data,
        };

        threadStorage.insert(userIdentity, threadToSave);
        return Ok(threadToSave.thread);
      }
    );
  }

  getThread() {
    return query(
      [text],
      Result(Thread, ErrorResponse),
      async (userIdentity) => {
        if (!userIdentity) {
          return Err({ error: { message: "userIdentity can not be empty" } });
        }
        const thread = threadStorage.get(userIdentity);
        if ("None" in thread) {
          return Err({
            error: { message: `No thread found for ${userIdentity}` },
          });
        }
        return Ok(thread.Some.thread);
      }
    );
  }

  deleteThread() {
    return update([text], Result(text, ErrorResponse), async (userIdentity) => {
      if (!userIdentity) {
        return Err({
          error: { message: "userIdentity can not be empty" },
        });
      }

      const threadToDelete = threadStorage.get(userIdentity);
      if ("None" in threadToDelete) {
        return Err({
          error: { message: `No thread found for ${userIdentity}` },
        });
      }

      threadStorage.remove(userIdentity);

      return Ok("Deleted");
    });
  }

  hasASavedThread(userIdentity: string) {
    const thread = threadStorage.get(userIdentity);
    if ("None" in thread) {
      return false;
    }
    return true;
  }
}

const assistant = new Assistant();
export default assistant;

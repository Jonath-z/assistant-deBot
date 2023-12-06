import {
  update,
  text,
  Ok,
  Err,
  Result,
  StableBTreeMap,
  query,
  bool,
} from "azle";
import { ErrorResponse } from "./models/error";
import { CreateThead, Thread } from "./models/assistant";

const threadStorage = StableBTreeMap(text, CreateThead, 4);

class Assistant {
  getAssistant(assistantId: string) {
    return query([], Result(text, ErrorResponse), () => {
      return Ok(assistantId);
    });
  }

  saveThread() {
    return update(
      [text, Thread],
      Result(Thread, ErrorResponse),
      async (userIdentity, thread) => {
        if (!userIdentity || !thread || typeof thread !== "object") {
          return Err({
            error: { message: "userIdentity and thread can not be empty" },
          });
        }

        // Support one thread for now, can add multiple threads support
        const hasASavedThread = this.hasASavedThread_(userIdentity);
        if (hasASavedThread) {
          const thread = threadStorage.get(userIdentity.trim());
          return Ok(thread.Some.thread);
        }

        const threadToSave: typeof CreateThead = {
          thread,
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

  hasASavedThread_(userIdentity: string) {
    const thread = threadStorage.get(userIdentity);
    if ("None" in thread) {
      return false;
    }
    return true;
  }

  hasASavedThread() {
    return query([text], bool, async (userIdentity) => {
      const thread = threadStorage.get(userIdentity);
      if ("None" in thread) {
        return false;
      }
      return true;
    });
  }
}

const assistant = new Assistant();
export default assistant;

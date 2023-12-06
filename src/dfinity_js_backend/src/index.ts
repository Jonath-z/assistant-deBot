import { Canister } from "azle";
import assistant from "./assistant";
import user from "./user";
import { ASSISTANT_ID } from "../../../credential";

let assistantId: string = ASSISTANT_ID ?? "";

export default Canister({
  getAssistant: assistant.getAssistant(assistantId),
  updateUsername: user.updateUsername(),
  getUsername: user.getUsername(),
  saveThread: assistant.saveThread(),
  deleteThread: assistant.deleteThread(),
  getThread: assistant.getThread(),
  hasASavedThread: assistant.hasASavedThread(),
});

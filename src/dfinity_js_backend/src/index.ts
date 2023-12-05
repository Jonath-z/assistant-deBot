import { query, Canister } from "azle";
import { HttpResponse, HttpTransformArgs } from "azle/canisters/management";
import assistant from "./assistant";
import user from "./user";

export default Canister({
  saveAssistant: assistant.saveAssistant(),
  getUserAssistants: assistant.getUserAssistants(),
  updateUsername: user.updateUsername(),
  getUsername: user.getUsername(),
  saveThread: assistant.saveThread(),
  deleteThread: assistant.deleteThread(),
  getThread: assistant.getThread(),
  transform: query([HttpTransformArgs], HttpResponse, (args) => {
    return {
      ...args.response,
      headers: [],
    };
  }),
  threadTransform: query([HttpTransformArgs], HttpResponse, (args) => {
    return {
      ...args.response,
      headers: [],
    };
  }),
});

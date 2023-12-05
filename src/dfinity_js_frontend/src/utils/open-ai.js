import toast from "react-hot-toast";
import { OPEN_AI_API_KEY } from "../../../../credential";
import {
  saveThread,
  deleteThread as deleteThreadFromCanister,
} from "./assistant";

const API_BASE_URL = "https://api.openai.com/v1";

export const deleteThread = async (threadId) => {
  const url = `${API_BASE_URL}/threads/${threadId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        "OpenAI-Beta": "assistants=v1",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.error) {
      throw data.error;
    }
    await deleteThreadFromCanister(window.auth.principalText);
    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.message || error.error.message);
  }
};

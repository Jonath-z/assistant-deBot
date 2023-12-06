import toast from "react-hot-toast";
import { retreiveAssistantFromOpenai } from "./chat";

export const getMyAssistant = async () => {
  try {
    const data = await window.canister.assistant.getAssistant();
    const assistant = retreiveAssistantFromOpenai(data.Ok);
    return assistant;
  } catch (error) {
    console.log(error);
    toast.error(error.message || error.error.message);
  }
};

export const updateUsername = async (username, userIdentity) => {
  try {
    const data = await window.canister.assistant.updateUsername(
      userIdentity,
      username
    );
    if (data.Err) {
      throw data.Err;
    }

    console.log(data.Ok);
    return data.Ok;
  } catch (error) {
    console.log(error);
    toast.error(error.message || error.error.message);
  }
};

export const getUsername = async (userIdentity) => {
  try {
    const data = await window.canister.assistant.getUsername(userIdentity);
    if (data.Err) {
      throw data.Err;
    }

    console.log(data.Ok);
    return data.Ok;
  } catch (error) {
    console.log(error);
  }
};

export const saveThread = async (userIdentity, thread) => {
  try {
    const data = await window.canister.assistant.saveThread(
      userIdentity,
      thread
    );
    if (data.Err) {
      throw data.Err;
    }

    return data.Ok;
  } catch (error) {
    console.log(error);
    toast.error(error.message || error.error.message);
  }
};

export const getThread = async (userIdentity) => {
  try {
    const data = await window.canister.assistant.getThread(userIdentity);
    if (data.Err) {
      throw data.Err;
    }

    return data.Ok;
  } catch (error) {
    console.log(error);
    toast.error(error.message || error.error.message);
  }
};

export const deleteThread = async (userIdentity) => {
  try {
    const data = await window.canister.assistant.deleteThread(userIdentity);
    if (data.Err) {
      throw data.Err;
    }

    return data.Ok;
  } catch (error) {
    console.error(error);
    toast.error(error.message || error.error.message);
  }
};

export const hasASavedThread = async (userIdentity) => {
  try {
    const data = await window.canister.assistant.hasASavedThread(userIdentity);
    if (data.Err) {
      throw data.Err;
    }

    return data;
  } catch (error) {
    console.error(error);
    toast.error(error.message || error.error.message);
  }
};

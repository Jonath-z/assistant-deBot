import toast from "react-hot-toast";

export const saveAssistant = async (assistantId, userIdentity) => {
  try {
    const data = await window.canister.assistant.saveAssistant(
      assistantId,
      userIdentity
    );
    if (data.Err) {
      throw data.Err;
    }

    console.log(data.Ok);
    return data.Ok;
  } catch (error) {
    console.error(error);
    toast.error(error.message || error.error.message);
  }
};

export const getMyAssistant = async (userIdentity) => {
  try {
    const data = await window.canister.assistant.getUserAssistants(
      userIdentity
    );
    if (data.Err) {
      throw data.Err;
    }

    console.log(data.Ok);
    return data.Ok;
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    toast.error(error.message || error.error.message);
  }
};

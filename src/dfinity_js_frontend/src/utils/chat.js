import { localStorageController } from "./localStorageController";

export async function createConversation(userIdentity) {
  try {
    return await window.canister.chat.createConversation({
      userIdentity,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getConversation(userIdentity) {
  try {
    return await window.canister.chat.getConversation(userIdentity);
  } catch (error) {
    console.log(error);
  }
}

export async function addMessageToConversation(message) {
  try {
    const userIdentity = window.auth.principalText;
    const conversationId = localStorageController("conversation")?.Ok.id;
    return await window.canister.chat.addMessageToConversation({
      userIdentity,
      conversationId,
      message,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteConversation(userIdentity) {
  try {
    return await window.canister.chat.deleteConversation(userIdentity);
  } catch (error) {
    console.log(error);
  }
}

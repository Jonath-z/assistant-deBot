import toast from "react-hot-toast";
import Openai from "openai";
import { OPEN_AI_API_KEY } from "../../../../credential";
import { hasASavedThread, saveThread, getThread } from "./assistantCanister";

// NOTE: This is only for testing purposes. The API should not be exposed in a real production app
const openai = new Openai({
  apiKey: OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const runTheAssistantOnTheThread = async (threadId, assistantId) => {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
    return run.id;
  } catch (e) {
    console.log(e);
  }
};

export const createThread = async (userIdentity) => {
  console.log(userIdentity);
  try {
    let thread = null;
    if (await hasASavedThread(userIdentity)) {
      thread = await getThread(userIdentity);
      console.log(thread);
      return thread;
    }
    thread = await openai.beta.threads.create();
    await saveThread(userIdentity, thread);
    return thread;
  } catch (e) {
    console.log(e);
    toast.error(e.message || e.error.message);
  }
};

export const createMessage = async (threadId, message, assistantId) => {
  try {
    const threadMessages = await openai.beta.threads.messages.create(
      threadId,
      message
    );

    console.log(threadMessages);
    return {
      role: threadMessages.role,
      content: threadMessages.content[0].text.value,
    };
  } catch (e) {
    toast.error(e.message);
    console.log(e);
  }
};

export const getAllThreadMessages = async (threadId) => {
  try {
    const threadMessages = await openai.beta.threads.messages.list(threadId);

    console.log(threadMessages.data);
    return threadMessages.data.map((message) => ({
      role: message.role,
      content: message.content[0].text.value,
    }));
  } catch (e) {
    console.log(e);
    toast.error(e.message);
  }
};

export const analyseRunsStepsDone = async (threadId, runId) => {
  const runStep = await openai.beta.threads.runs.steps.list(threadId, runId);
  const completedStep = runStep.data.find(
    (step) => step.status === "completed"
  );

  if (completedStep) {
    return true;
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return await analyseRunsStepsDone(threadId, runId);
  }
};

export const retreiveAssistantFromOpenai = async (assistantid) => {
  const assistant = await openai.beta.assistants.retrieve(assistantid);
  return assistant;
};

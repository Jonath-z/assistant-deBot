import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getMyAssistant,
  getThread,
  saveThread as initThread,
} from "../utils/assistant";

const AssistantContext = createContext();
export const useAssistant = () => useContext(AssistantContext);

const AssistantProvider = ({ children }) => {
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);

  const getAssistant = async () => {
    try {
      const data = await getMyAssistant(window.auth.principalText);
      setAssistant(data[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const saveThread = async (assistantId) => {
    try {
      const data = await initThread(window.auth.principalText, assistantId);
      setThread(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (window.auth.principalText && window.auth.isAuthenticated) {
      getAssistant();
    }
  }, [window.auth.principalText]);

  useEffect(() => {
    if (
      window.auth.principalText &&
      window.auth.isAuthenticated &&
      assistant?.id
    ) {
      saveThread(assistant.id);
    }
  }, [window.auth.principalText, assistant?.id]);

  return (
    <AssistantContext.Provider
      value={{ assistant, setAssistant, thread, setThread }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;

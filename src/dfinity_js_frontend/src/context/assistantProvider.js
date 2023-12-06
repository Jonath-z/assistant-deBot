import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyAssistant } from "../utils/assistantCanister";
import { createThread } from "../utils/chat";

const AssistantContext = createContext();
export const useAssistant = () => useContext(AssistantContext);

const AssistantProvider = ({ children }) => {
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);

  const getAssistant = async () => {
    try {
      const data = await getMyAssistant();
      console.log(data);
      setAssistant(data);
    } catch (e) {
      console.log(e);
    }
  };

  const saveThread = async () => {
    try {
      const data = await createThread(window.auth.principalText);
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
      saveThread();
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

import React, { useState } from "react";
import Loading from "./Loading";
import { useEffect } from "react";
import { login, logout } from "../utils/auth";
import toast from "react-hot-toast";
import SaveAssistant from "./SaveAssistant";
import { useAssistant } from "../context/assistantProvider";
import {
  analyseRunsStepsDone,
  createMessage,
  getAllThreadMessages,
  runTheAssistantOnTheThread,
} from "../utils/chat";
import { useUser } from "../context/userProvider";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const { username } = useUser();
  const [chatMessage, setChatMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assistantModalOpened, setAssistantIdModalOpened] = useState(false);
  const { assistant, thread } = useAssistant();

  const updateChatMessage = async () => {
    if (
      window.auth.principalText &&
      window.auth.isAuthenticated &&
      thread?.id
    ) {
      const messages = await getAllThreadMessages(thread.id);
      setChatMessage(messages);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!window.auth.isAuthenticated) {
      toast.error("You are not authenticated");
      return;
    }

    if (!assistant?.id) {
      toast.error("You need to add an assistant first");
      return;
    }

    if (!thread?.id || !assistant?.id) {
      console.log("Cannot create a message without a thread or an assistant");
      return;
    }

    if (!question) return;

    const messageToSend = { content: question, role: "user" };
    setChatMessage((prev) => [messageToSend, ...prev]);
    setLoading(true);
    await createMessage(thread.id, messageToSend);
    setQuestion("");
    const runId = await runTheAssistantOnTheThread(thread.id, assistant.id);
    const done = await analyseRunsStepsDone(thread.id, runId);
    if (done) {
      await updateChatMessage();
      setLoading(false);
    }
  };

  useEffect(() => {
    updateChatMessage();
  }, [window.auth.principalText, window.auth.isAuthenticated, thread?.id]);

  return (
    <div className="wrapper">
      {assistantModalOpened && (
        <SaveAssistant onClose={() => setAssistantIdModalOpened(false)} />
      )}
      <div className="wrapper-header">
        <h1>De-assistant bot</h1>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <button
            className="auth-button auth-button__hover"
            onClick={() => (window.auth.isAuthenticated ? logout() : login())}
          >
            {window.auth.isAuthenticated
              ? `Log out from ${assistant?.name ?? ""}`
              : "Login"}
          </button>
          {window.auth.isAuthenticated && (
            <button
              onClick={() => setAssistantIdModalOpened(true)}
              className="auth-button auth-button__hover"
            >
              {username ?? "Update username"}
            </button>
          )}
        </div>
      </div>
      <div className="container">
        <div className="right">
          <div className="chat active-chat">
            <div className="conversation-start"></div>
            {chatMessage
              .map((message, index) => (
                <div
                  key={index}
                  className={`bubble ${
                    message.role === "user" ? "me" : "assistant"
                  } ${
                    chatMessage.length - 1 === index && !loading
                      ? "last-message"
                      : ""
                  }
                `}
                >
                  {message.content}
                </div>
              ))
              .reverse()}

            {loading && (
              <div className={`bubble assistant`}>
                <Loading />
              </div>
            )}
          </div>
          <div className="write">
            <input
              placeholder="Ask me..."
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {loading && <Loading />}
            {!loading && (
              <a
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="write-link send"
              ></a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

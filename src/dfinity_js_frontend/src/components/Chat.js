import React, { useState } from "react";
import useApi from "../hooks/useApi";
import Loading from "./Loading";
import { useEffect } from "react";
import { login, logout } from "../utils/auth";
import toast from "react-hot-toast";
import SaveAssistant from "./SaveAssistant";
import { useAssistant } from "../context/assistantProvider";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const { loading, chatCompletion, chatMessage, setChatMessage } = useApi();
  const [assistantModalOpened, setAssistantIdModalOpened] = useState(false);
  const { assistant } = useAssistant();

  const updateChatMessage = async () => {
    if (window.auth.principalText && window.auth.isAuthenticated) {
    }
  };

  const handleSubmit = async (event) => {
    if (!window.auth.isAuthenticated) {
      toast.error("You are not authenticated");
      return;
    }

    if (question) {
      const history = [...chatMessage, { content: question, role: "user" }];
      setChatMessage(() => [...history]);
      await chatCompletion(history);
      setQuestion("");
    }
  };

  useEffect(() => {
    updateChatMessage();
  }, []);

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
            {window.auth.isAuthenticated ? "Log out" : "Login"}
          </button>
          {window.auth.isAuthenticated && (
            <button
              onClick={() => setAssistantIdModalOpened(true)}
              className="auth-button auth-button__hover"
            >
              {assistant?.name ?? "Add Assistant"}
            </button>
          )}
        </div>
      </div>
      <div className="container">
        <div className="right">
          <div className="chat active-chat">
            <div className="conversation-start"></div>
            {chatMessage.map((message, index) => (
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
            ))}

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

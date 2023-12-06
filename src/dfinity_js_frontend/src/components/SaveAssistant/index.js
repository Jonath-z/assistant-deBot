import React from "react";
import "./saveAssistant.css";
import UpdateUsername from "../UpdateUsername";

const SaveAssistant = ({ onClose }) => {
  return (
    <div className="save-assistant-container">
      <div className="save-assistant__content-container">
        <UpdateUsername onClose={onClose} />
      </div>
    </div>
  );
};

export default SaveAssistant;

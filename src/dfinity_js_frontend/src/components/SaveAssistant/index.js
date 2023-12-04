import React from "react";
import { saveAssistant } from "../../utils/assistant";
import "./saveAssistant.css";
import toast from "react-hot-toast";

const SaveAssistant = ({ onClose }) => {
  const [assistantId, setAssistantId] = React.useState("");

  const onAssistantIdChange = (event) => {
    setAssistantId(event.target.value);
  };

  const onAssistantIdSubmit = async (event) => {
    event.preventDefault();
    if (!assistantId) {
      toast.error("Please enter assistant id");
      return;
    }
    await saveAssistant(assistantId, window.auth.principalText);
  };

  return (
    <div className="save-assistant-container">
      <div className="save-assistant__content-container">
        <input
          className="save-assistant__content-container__input"
          type="text"
          placeholder="Assistant id (ass_sojrlkejiIO9xxsd)"
          onChange={onAssistantIdChange}
        />
        <div>
          <button
            onClick={() => onClose}
            className="save-assistant__content-container__submit-button"
          >
            Save Canister
          </button>
          <button
            onClick={onAssistantIdSubmit}
            className="save-assistant__content-container__submit-button"
          >
            Save Canister
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveAssistant;

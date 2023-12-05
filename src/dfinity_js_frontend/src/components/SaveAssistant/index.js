import React from "react";
import { saveAssistant } from "../../utils/assistant";
import "./saveAssistant.css";
import toast from "react-hot-toast";
import { useAssistant } from "../../context/assistantProvider";

const SaveAssistant = ({ onClose }) => {
  const [assistantId, setAssistantId] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const { setAssistant } = useAssistant();

  const onAssistantIdChange = (event) => {
    setAssistantId(event.target.value);
  };

  const onAssistantIdSubmit = async (event) => {
    event.preventDefault();
    if (!assistantId) {
      toast.error("Please enter assistant id");
      return;
    }
    try {
      setSaving(true);
      const assistant = await saveAssistant(
        assistantId,
        window.auth.principalText
      );
      setAssistant(assistant);
      console.log(assistant);
      onClose();
    } catch (e) {
      console.log(e);
    } finally {
      setSaving(false);
    }
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
        <div className="assitant__button-container">
          <button
            onClick={onClose}
            className="save-assistant__content-container__cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={onAssistantIdSubmit}
            className="save-assistant__content-container__submit-button"
          >
            {saving ? "Validating..." : "Save Canister"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveAssistant;

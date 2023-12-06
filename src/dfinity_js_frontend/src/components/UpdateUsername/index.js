import { useUser } from "../../context/userProvider";
import { updateUsername } from "../../utils/assistantCanister";
import React, { useState } from "react";

const UpdateUsername = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const { setUsername: dispatchUsername } = useUser();

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const onUsernameSubmit = async (event) => {
    event.preventDefault();
    if (!username) {
      toast.error("Please enter username");
      return;
    }

    try {
      setSaving(true);
      const newUsername = await updateUsername(
        username.trim(),
        window.auth.principalText
      );
      console.log(newUsername);
      dispatchUsername(newUsername);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.message || error.error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <input
          className="save-assistant__content-container__input"
          type="text"
          placeholder="Username"
          onChange={onUsernameChange}
          value={username}
        />
        <div className="assitant__button-container">
          <button
            onClick={onClose}
            className="save-assistant__content-container__cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={onUsernameSubmit}
            className="save-assistant__content-container__submit-button"
          >
            {saving ? "Creating..." : "Save username"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUsername;

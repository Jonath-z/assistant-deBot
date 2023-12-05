import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeContract } from "./utils/icp";
import AssistantProvider from "./context/assistantProvider";
import UserProvider from "./context/userProvider";

window.renderICPromise = initializeContract()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <AssistantProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AssistantProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch(console.error);

reportWebVitals();

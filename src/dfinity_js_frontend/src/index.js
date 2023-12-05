import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeContract } from "./utils/icp";
import AssistantProvider from "./context/assistantProvider";

window.renderICPromise = initializeContract()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <AssistantProvider>
          <App />
        </AssistantProvider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  })
  .catch(console.error);

reportWebVitals();

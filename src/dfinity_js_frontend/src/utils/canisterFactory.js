import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as marketPlaceIDL } from "../../../declarations/dfinity_js_backend/dfinity_js_backend.did.js";

const CHAT_CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export async function getChatCanister() {
  return await getCanister(CHAT_CANISTER_ID, marketPlaceIDL);
}

async function getCanister(canisterId, idl) {
  const authClient = window.auth.client;
  const agent = new HttpAgent({
    identity: authClient.getIdentity(),
  });
  await agent.fetchRootKey();
  return Actor.createActor(idl, {
    agent,
    canisterId,
  });
}

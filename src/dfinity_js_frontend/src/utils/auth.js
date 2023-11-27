import { AuthClient } from "@dfinity/auth-client";
import { createConversation } from "./chat";

const MAX_TTL = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);
const IDENTITY_PROVIDER = `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/`;

export async function getAuthClient() {
  return await AuthClient.create();
}

export async function login() {
  const authClient = window.auth.client;

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    await authClient?.login({
      maxTimeToLive: MAX_TTL,
      identityProvider: IDENTITY_PROVIDER,
      onSuccess: async () => {
        window.auth.isAuthenticated = await authClient.isAuthenticated();

        const conversation = await createConversation(
          await authClient.getIdentity()?.getPrincipal().toText()
        );
        localStorage.setItem("conversation", JSON.stringify(conversation));
        window.location.reload();
      },
    });
  }
}

export async function logout() {
  const authClient = window.auth.client;
  localStorage.removeItem("conversation");
  authClient.logout();
  window.location.reload();
}

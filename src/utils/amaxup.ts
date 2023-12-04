import { Client, ServerEventType, Account } from "@amax/amaxup";

export function getAmaxupClient(): Client {
  if (!window.amaxupClient) {
    window.amaxupClient = new Client();
  }
  return window.amaxupClient;
}

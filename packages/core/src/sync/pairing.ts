import { brand } from "../guide";
import { call } from "./api";
import { deviceLabel, isApple } from "./label";
import { dropRecord } from "./local";
import { syncSoon } from "./engine";
import { installed } from "../persistence";
import { setSyncStatus } from "../store/sync";

/** The calls behind the Sync screen: showing a code, typing one, listing the devices, and leaving. */

export interface Device {
  label: string;
  seen: number;
  self: boolean;
}

export type CodeResult = { ok: true; code: string; linked: boolean } | { ok: false; why: "offline" | "limit" | "error" };
export type ClaimResult = { ok: true; already: boolean; moved: boolean } | { ok: false; why: "code" | "limit" | "full" | "offline" | "error" };
export type StatusResult = { ok: true; linked: boolean; devices: Device[]; now: number } | { ok: false; why: "offline" | "unlinked" | "error" };

// The guide's name goes in only where an installed guide is a device of its own: on Apple devices, where each has its own cookies.
// An installed Chrome or Edge app normally shares its browser's, so it is one device with the tab, whichever guide linked it.
const label = () => deviceLabel(navigator.userAgent, installed(), navigator.maxTouchPoints, isApple() ? brand.shortName : "");

/** Ask for a code to show on this device. */
export async function startCode(): Promise<CodeResult> {
  const { status, body } = await call<{ code?: string; linked?: boolean }>("/pair/start", { label: label() });
  if (status === 200 && typeof body?.code === "string") return { ok: true, code: body.code, linked: body.linked === true };
  return { ok: false, why: status === 0 ? "offline" : status === 429 ? "limit" : "error" };
}

/** Whether the code this device showed has been used (this device is then linked), and who is in the group. */
export async function checkStatus(): Promise<StatusResult> {
  const { status, body } = await call<{ linked?: boolean; devices?: Device[]; now?: number }>("/status");
  if (status === 0) return { ok: false, why: "offline" };
  if (status === 401) return { ok: false, why: "unlinked" };
  if (status !== 200 || !body) return { ok: false, why: "error" };
  const devices = Array.isArray(body.devices) ? body.devices.filter((d) => typeof d?.label === "string" && typeof d.seen === "number") : [];
  return { ok: true, linked: body.linked === true, devices, now: typeof body.now === "number" ? body.now : Date.now() };
}

/** Type the code another device is showing. */
export async function claimCode(code: string): Promise<ClaimResult> {
  const { status, body } = await call<{ already?: boolean; moved?: boolean }>("/pair/claim", { code, label: label() });
  if (status === 200) return { ok: true, already: body?.already === true, moved: body?.moved === true };
  if (status === 400) return { ok: false, why: "code" };
  if (status === 409) return { ok: false, why: "full" };
  return { ok: false, why: status === 0 ? "offline" : status === 429 ? "limit" : "error" };
}

/** This device has just been linked (by either side of a code): join the group and sync. */
export function afterLinked() {
  setSyncStatus({ phase: "joining" });
  syncSoon();
}

/** Take this device out of its group. Progress stays on it. False when the service couldn't be reached, and nothing changed. */
export async function unlinkDevice(): Promise<boolean> {
  const { status } = await call("/unlink");
  if (status !== 200) return false;
  dropRecord();
  setSyncStatus({ phase: "off", devices: 0 });
  return true;
}

/** Delete the group's progress from the server and unlink every device in it. Progress stays on each device. */
export async function forgetGroup(): Promise<boolean> {
  const { status } = await call("/forget");
  // 401: it is gone already (another device did it), and this one is unlinked all the same.
  if (status !== 200 && status !== 401) return false;
  dropRecord();
  setSyncStatus({ phase: "off", devices: 0 });
  return true;
}

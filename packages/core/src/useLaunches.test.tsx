import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { defaultState } from "./progress-state";
import { forgetPlaces, tabPlaces } from "./store/place";
import { useProgress } from "./store/progress";
import { launchTarget, useLaunches } from "./useLaunches";

type Consumer = (params: { targetURL?: string }) => void;
let consumer: Consumer | undefined;

beforeEach(() => {
  consumer = undefined;
  forgetPlaces();
  useProgress.setState({ data: { ...defaultState(), chapter: 1 }, storageError: false });
  Object.defineProperty(window, "launchQueue", { configurable: true, value: { setConsumer: (next: Consumer) => (consumer = next) } });
});

afterEach(() => {
  delete (window as { launchQueue?: unknown }).launchQueue;
});

describe("where a launch takes an open window", () => {
  it("nowhere for the app's icon, the start address", () => {
    expect(launchTarget("/", "/guide/1")).toBeNull();
  });

  it("where the shortcut's tab goes, as a reader coming back: the saved chapter, the checklist as it was left, the progress page", () => {
    tabPlaces.checklist = "/checklist/all/1";
    expect(launchTarget("/guide", "/dashboard")).toEqual({ to: "/guide/1", restore: true });
    expect(launchTarget("/checklist", "/guide/1")).toEqual({ to: "/checklist/all/1", restore: true });
    expect(launchTarget("/dashboard", "/guide/1")).toEqual({ to: "/dashboard", restore: true });
  });

  it("nowhere when the reader is on that page already, wherever in it", () => {
    expect(launchTarget("/guide", "/guide/1/some-entry")).toBeNull();
    expect(launchTarget("/dashboard", "/dashboard#stats")).toBeNull();
    tabPlaces.checklist = "/checklist/all/1";
    expect(launchTarget("/checklist", "/checklist/all/1")).toBeNull();
  });

  it("to any other address of the guide as a link", () => {
    expect(launchTarget("/sources", "/guide/1")).toEqual({ to: "/sources", restore: false });
    expect(launchTarget("/sources", "/sources")).toBeNull();
  });
});

function Probe() {
  useLaunches();
  const { pathname, state } = useLocation();
  return <p data-testid="path">{`${pathname} ${(state as { restore?: boolean } | null)?.restore ? "restore" : "new"}`}</p>;
}

const shown = () => screen.getByTestId("path").textContent;

describe("a launch while the guide's window is open", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/guide/1");
    render(
      <MemoryRouter initialEntries={["/guide/1"]}>
        <Probe />
      </MemoryRouter>,
    );
  });

  it("leaves the reader where they are for the app's icon", () => {
    act(() => consumer?.({ targetURL: `${window.location.origin}/` }));
    expect(shown()).toBe("/guide/1 new");
  });

  it("moves to a shortcut's page as its tab would", () => {
    act(() => consumer?.({ targetURL: `${window.location.origin}/checklist` }));
    expect(shown()).toBe("/checklist restore");
  });

  it("does nothing for an address of another site", () => {
    act(() => consumer?.({ targetURL: "https://example.com/checklist" }));
    expect(shown()).toBe("/guide/1 new");
  });
});

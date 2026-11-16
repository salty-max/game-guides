import { ChecklistPage } from "@hundo/core/pages/ChecklistPage";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect, userEvent, waitFor, within } from "storybook/test";

// The checklist's filters on a phone: the category chips on one line and the search on the page, the category, chapter and status
// behind one button, in a sheet, and what's on as chips that turn it off.
const meta = {
  title: "Core/ChecklistFilters",
  component: ChecklistPage,
  globals: { viewport: { value: "phone", isRotated: false } },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter initialEntries={["/checklist"]}>
          <Routes>
            <Route path="/checklist" element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof ChecklistPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);
const patient = { timeout: 15_000 };

/** The page as a phone shows it: no selects, a Filters button. */
export const Closed: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Filters" })).toBeVisible();
    await expect(canvas.queryByRole("combobox", { name: "Status" })).toBeNull();
  },
};

/** The sheet sets a status; closed, the button counts it and a chip turns it off. */
export const Filtering: Story = {
  play: async ({ canvasElement, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    const sheet = await page(canvasElement).findByRole("dialog", { name: "Filters" }, patient);
    await userEvent.click(within(sheet).getByRole("combobox", { name: "Status" }));
    await userEvent.click(await page(canvasElement).findByRole("option", { name: "Completed" }, patient));
    await userEvent.click(within(sheet).getByRole("button", { name: /^Show \d+ match/ }));
    await waitFor(() => expect(page(canvasElement).queryByRole("dialog", { name: "Filters" })).toBeNull(), patient);
    await expect(canvas.getByRole("button", { name: "Filters, 1 on" })).toHaveTextContent("Filters · 1");
    await userEvent.click(canvas.getByRole("button", { name: "Remove filter: Completed" }));
    await expect(canvas.getByRole("button", { name: "Filters" })).toHaveFocus();
  },
};

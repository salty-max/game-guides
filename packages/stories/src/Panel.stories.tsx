import { TextField } from "@hundo/core/components/TextField";
import { Button, ChipGroup, Panel, PanelActions, PanelFigure, PanelForm, PanelHead, PanelText, PanelTitle } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

// A panel on the dashboard, or a guide's own (Koholint's deathless run, Red Dead's calibration): a title and the words that open it, words
// in three tones, a row of buttons. The panel keeps the room between its parts, roomy or snug.
const meta = {
  title: "Core/Panel",
  component: Panel,
  args: { pad: "roomy" },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  render: (args) => (
    <Panel {...args}>
      <PanelHead>
        <PanelTitle>Progress backup</PanelTitle>
        <PanelText>Progress lives in this browser. Export a backup to move it to another device or keep a copy.</PanelText>
      </PanelHead>
      <PanelActions>
        <Button>Export progress</Button>
        <Button>Import progress</Button>
      </PanelActions>
    </Panel>
  ),
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A title, the muted words every panel opens with, and its buttons. */
export const WithActions: Story = {};

/** Snug, as Next up: a short list between other parts of a page, with less room inside and between its parts. */
export const Snug: Story = { args: { pad: "snug" } };

/** The three tones: muted as a rule, ink for a result the reader asked for, the error colour for what went wrong. */
export const Tones: Story = {
  render: (args) => (
    <Panel {...args} aria-labelledby="tones-title">
      <PanelHead>
        <PanelTitle id="tones-title">Check against the game</PanelTitle>
        <PanelText>Enter the completion percentage from Stats → General to see how far this guide’s estimate is off.</PanelText>
      </PanelHead>
      <PanelText tone="ink">Guide 42% · game 44% · the game is 2 points ahead.</PanelText>
      <PanelText tone="error">Enter a number from 0 to 100.</PanelText>
    </Panel>
  ),
};

/** A guide's run log (Koholint's deathless run): its mode chips under the title, one big number, words, and buttons. */
export const Figure: Story = {
  render: (args) => (
    <Panel {...args}>
      <PanelTitle>Deathless run</PanelTitle>
      <ChipGroup label="Run mode" choices={[["normal", "Normal"], ["hero", "Hero"]]} value="normal" onChange={() => {}} />
      <PanelFigure value={3} unit="deaths" />
      <PanelText>A Game Over ends this deathless attempt. Your collection checklist still works for this file.</PanelText>
      <PanelActions>
        <Button icon="plus">Log death</Button>
        <Button icon="minus">Undo death</Button>
      </PanelActions>
    </Panel>
  ),
};

/** A form in a panel (Red Dead's calibration): a short field with its buttons beside it. */
export const Form: Story = {
  render: (args) => (
    <Panel {...args} aria-labelledby="form-title">
      <PanelHead>
        <PanelTitle id="form-title">Check against the game</PanelTitle>
        <PanelText>Enter the completion percentage from Stats → General to see how far this guide’s estimate is off.</PanelText>
      </PanelHead>
      <PanelForm onSubmit={(event) => event.preventDefault()}>
        <TextField
          id="reported"
          label="In-game completion (%)"
          inputMode="decimal"
          width="short"
          value="42"
          onChange={() => {}}
          actions={
            <Button type="submit" look="">
              Save
            </Button>
          }
        />
      </PanelForm>
    </Panel>
  ),
};

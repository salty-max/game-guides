import { Panel, PanelActions, PanelText, PanelTitle, Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

// A panel on the dashboard or the sources page, or a guide's own (Koholint's deathless run, Red Dead's calibration): a title, words in
// three tones, a row of buttons, and the room it keeps from its neighbours.
const meta = {
  title: "Core/Panel",
  component: Panel,
  args: { space: "none" },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  render: (args) => (
    <Panel {...args}>
      <PanelTitle>Progress backup</PanelTitle>
      <PanelText>Progress lives in this browser. Export a backup to move it to another device or keep a copy.</PanelText>
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

/** The three tones: muted as a rule, ink for a result the reader asked for, the error colour for what went wrong. */
export const Tones: Story = {
  render: (args) => (
    <Panel {...args} aria-labelledby="tones-title">
      <PanelTitle id="tones-title">Check against the game</PanelTitle>
      <PanelText>Enter the completion percentage from Stats → General to see how far this guide’s estimate is off.</PanelText>
      <PanelText tone="ink">Guide 42% · game 44% · the game is 2 points ahead.</PanelText>
      <PanelText tone="error">Enter a number from 0 to 100.</PanelText>
    </Panel>
  ),
};

/** `space`: room above (a panel under another) and below (a panel over the next block), shown between two plain lines. */
export const Spacing: Story = {
  render: () => (
    <>
      <p>Above</p>
      <Panel space="above">
        <PanelTitle>Room above</PanelTitle>
      </Panel>
      <Panel space="below">
        <PanelTitle>Room below</PanelTitle>
      </Panel>
      <p>Below</p>
    </>
  ),
};

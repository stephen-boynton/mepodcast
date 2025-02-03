import type { Meta, StoryObj } from "@storybook/react";

import { PodcastPlayer } from "./PodcastPlayer";

const meta: Meta<typeof PodcastPlayer> = {
  component: PodcastPlayer,
};

export default meta;

type Story = StoryObj<typeof PodcastPlayer>;

export const Primary: Story = {
  args: {
    primary: true,
    label: "Button",
  },
};

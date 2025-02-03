import type { Preview } from "@storybook/react";
import { ThemeWrapper } from "./ThemeWrapper";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [ThemeWrapper],
};

export default preview;

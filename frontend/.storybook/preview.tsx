import type { Preview } from '@storybook/react-vite';
import './story.scss';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import ToastProvider from '../src/context/toast/ToastProvider';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByDataAttribute({
      defaultTheme: 'light',
      themes: {
        light: 'light',
        dark: 'dark'
      },
      attributeName: 'data-theme'
    }),

    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    )
  ]
};

export default preview;

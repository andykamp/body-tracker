import * as React from 'react';
import '../src/Theme/global.css';
import ThemeProvider from '../src/Theme/ThemeProvider'
import { Preview, StoryFn, DecoratorFn } from '@storybook/react'

// theme

const withTheme: DecoratorFn = (StoryFn: StoryFn, context) => {
  // Get the active theme value from the story parameter
  const theme = context.parameters.theme || context.globals.theme

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{ height: "100vh", width: "100vw" }}
      >
        <StoryFn />
      </div>
    </ThemeProvider>
  )
}

// export all decorators that should be globally applied in an array
export const decorators = [withTheme]

// globalTypes

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
}

//preview params

const preview: Preview = {
  parameters: {
    layout: 'fullscreen', // This ensures that the layout takes the full space
    backgrounds: {
      disable: true,
    },
  },
};

export default preview;


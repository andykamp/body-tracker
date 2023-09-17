import * as React from 'react';
import ThemeProvider from '../../ui/src/Theme/ThemeProvider'
import { StoryFn, DecoratorFn } from '@storybook/react'
import {
  globalTypes as rootGlobalTypes,
  preview as rootPreview
} from "../../../.storybook/preview"

export const globalTypes = {
  ...rootGlobalTypes,
}

export const parameters = {
  ...rootPreview,
}

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

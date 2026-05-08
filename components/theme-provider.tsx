'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

declare global {
  // eslint-disable-next-line no-var
  var __nattyopiaThemeScriptWarnFiltered: boolean | undefined
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!globalThis.__nattyopiaThemeScriptWarnFiltered) {
    globalThis.__nattyopiaThemeScriptWarnFiltered = true
    const original = console.error
    console.error = (...args: unknown[]) => {
      const first = args[0]
      if (typeof first === 'string' && first.includes('Encountered a script tag while rendering React component')) {
        return
      }
      original(...args)
    }
  }
}

/** next-themes: pair with `attribute="class"` on the document root and `.dark` in globals.css. */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

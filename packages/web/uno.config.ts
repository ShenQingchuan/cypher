import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'JetBrains Mono',
      },
    }),
  ],
  theme: {
    colors: {
      primary: '#1a73e8',
      success: '#34a853',
      warning: '#fbbc04',
      error: '#ea4335',
      surface: '#ffffff',
      background: '#f5f5f5',
    },
  },
})

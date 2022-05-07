import * as de from './lang/de.js'
import * as enUS from './lang/en-US.js'
import * as fi from './lang/fi.js'
import * as ptBR from './lang/pt-BR.js'

// https://discord.com/developers/docs/reference#locales

const locales = {
  'de': de,
  'en-US': enUS,
  'fi': fi,
  'pt-BR': ptBR
}

export function getLanguage(locale) {
  if (!(locale in locales)) { return locales['en-US'] }
  return locales[locale]
}

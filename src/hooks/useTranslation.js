import { useCallback } from 'react'
import uz from '../i18n/uz.json'
import ru from '../i18n/ru.json'
import { useStorage } from './useStorage'

const langs = { uz, ru }

export function useTranslation() {
  const [lang, setLang] = useStorage('healthtracker_lang', 'uz')

  const t = useCallback((key, params) => {
    const keys = key.split('.')
    let val = langs[lang] || langs.uz
    for (const k of keys) {
      val = val?.[k]
    }
    if (val == null) return key

    // Simple template replacement: {name} → params.name
    if (params && typeof val === 'string') {
      return val.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
    }
    return val
  }, [lang])

  return { t, lang, setLang }
}

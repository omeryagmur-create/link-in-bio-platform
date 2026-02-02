import tr from './dictionaries/tr.json'
import en from './dictionaries/en.json'
import ru from './dictionaries/ru.json'
import de from './dictionaries/de.json'
import { cookies } from 'next/headers'

type Language = 'tr' | 'en' | 'ru' | 'de'

const dictionaries = {
    tr,
    en,
    ru,
    de,
}

export async function getTranslation() {
    const cookieStore = await cookies()
    const language = (cookieStore.get('language')?.value as Language) || 'tr'

    const dictionary = dictionaries[language] || dictionaries.tr

    return {
        language,
        t: (path: string, variables?: Record<string, string | number>) => {
            const keys = path.split('.')
            let result: any = dictionary

            for (const key of keys) {
                if (result && result[key]) {
                    result = result[key]
                } else {
                    return path
                }
            }

            let translated = typeof result === 'string' ? result : path

            if (variables) {
                Object.entries(variables).forEach(([key, value]) => {
                    translated = translated.replace(`{${key}}`, String(value))
                })
            }

            return translated
        }
    }
}

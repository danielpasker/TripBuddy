import { getName, getNames } from 'i18n-iso-countries'


export const getCountryNameFromCountryCode = (code: string) => {
    const countryName = getName(code, 'en', { select: 'official' })
    if (!countryName) {
        throw Error(`Country name of ${code} not found`)
    }
    return countryName
}

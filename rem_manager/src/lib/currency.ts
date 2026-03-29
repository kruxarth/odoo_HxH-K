export interface CountryCurrency {
  name: string
  code: string
  currencyCode: string
  currencySymbol: string
}

export async function fetchCountriesWithCurrencies(): Promise<CountryCurrency[]> {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2', {
      next: { revalidate: 86400 },
    })
    const data = await res.json() as any[]
    const result: CountryCurrency[] = []
    for (const country of data) {
      const currencies = country.currencies as Record<string, { name: string; symbol: string }> | undefined
      if (!currencies) continue
      for (const [code, info] of Object.entries(currencies)) {
        result.push({
          name: country.name?.common ?? '',
          code: country.cca2 ?? '',
          currencyCode: code,
          currencySymbol: info.symbol ?? code,
        })
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return []
  }
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  if (from === to) return amount
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
    const data = await res.json() as { rates: Record<string, number> }
    const rate = data.rates?.[to]
    if (!rate) return amount
    return amount * rate
  } catch {
    return amount
  }
}

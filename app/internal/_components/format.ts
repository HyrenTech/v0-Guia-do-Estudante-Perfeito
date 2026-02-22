export const fmtCurrency = (value: unknown, currency = "BRL") => {
  const number = Number(value ?? 0)
  if (!Number.isFinite(number)) return "-"

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(number)
}

export const fmtNumber = (value: unknown, digits = 0) => {
  const number = Number(value ?? 0)
  if (!Number.isFinite(number)) return "-"

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number)
}

export const fmtPercent = (value: unknown, digits = 2) => {
  const number = Number(value ?? 0)
  if (!Number.isFinite(number)) return "-"

  return `${fmtNumber(number, digits)}%`
}

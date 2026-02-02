type Fbq = (...args: unknown[]) => void

const PRODUCT = {
  name: "Guia 31 Dias",
  category: "curso",
  ids: ["guia-31-dias"],
  value: 97,
  currency: "BRL",
} as const

const getFbq = (): Fbq | null => {
  if (typeof window === "undefined") return null
  const fbq = (window as typeof window & { fbq?: Fbq }).fbq
  return typeof fbq === "function" ? fbq : null
}

const basePayload = (location: string) => ({
  content_name: PRODUCT.name,
  content_category: PRODUCT.category,
  content_ids: PRODUCT.ids,
  button_location: location,
})

export const trackClickBuy = (location: string) => {
  const fbq = getFbq()
  if (!fbq) return
  fbq("trackCustom", "ClickBuy", basePayload(location))
}

export const trackInitiateCheckout = (location: string) => {
  const fbq = getFbq()
  if (!fbq) return
  fbq("track", "InitiateCheckout", basePayload(location))
}

export const trackBuyClick = (location: string) => {
  trackClickBuy(location)
  trackInitiateCheckout(location)
}

export const trackPurchase = () => {
  const fbq = getFbq()
  if (!fbq) return
  fbq("track", "Purchase", {
    content_name: PRODUCT.name,
    content_category: PRODUCT.category,
    content_ids: PRODUCT.ids,
    value: PRODUCT.value,
    currency: PRODUCT.currency,
  })
}

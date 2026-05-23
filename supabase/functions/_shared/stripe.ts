export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export async function stripeRequest(secretKey: string, path: string, body: URLSearchParams) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Stripe error ${res.status}: ${err}`)
  }
  return res.json()
}

export function flattenParams(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}[${key}]` : key
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === 'object') {
            Object.assign(result, flattenParams(item as Record<string, unknown>, `${k}[${i}]`))
          } else {
            result[`${k}[${i}]`] = String(item)
          }
        })
      } else if (typeof value === 'object') {
        Object.assign(result, flattenParams(value as Record<string, unknown>, k))
      } else {
        result[k] = String(value)
      }
    }
  }
  return result
}

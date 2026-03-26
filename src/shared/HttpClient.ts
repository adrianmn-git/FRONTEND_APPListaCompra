import nookies from 'nookies'

export type HttpClientMethods = 'POST' | 'PUT' | 'GET' | 'PATCH' | 'DELETE'

export async function HttpClient(
    url: string,
    method: HttpClientMethods,
    body?: string | FormData
) {
    const token = nookies.get(undefined).TOKEN ?? ''

    const additionalHeaders = typeof body === 'string' ? { "Content-Type": "application/json" } : {}

    return await fetch(url, {
        method: method,
        headers: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(additionalHeaders as any),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body
    })
}

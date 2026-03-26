import nookies from 'nookies'

const COOKIE_NAME = 'TOKEN'

export class TokenManager {
    static set(token: string | null) {
        if (!token) {
            nookies.destroy(undefined, COOKIE_NAME)
            return
        }

        nookies.set(undefined, COOKIE_NAME, token, { path: '/' })
    }

    static get(): string | undefined {
        return nookies.get(undefined)[COOKIE_NAME] || undefined
    }
}

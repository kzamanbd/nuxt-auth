import { $fetch, FetchError, type FetchOptions } from 'ofetch';

export const $X_TOKEN = 'X-TOKEN';
export const $AUTH_HEADER = 'Authorization';

// https://github.com/axios/axios/blob/bdf493cf8b84eb3e3440e72d5725ba0f138e0451/lib/helpers/cookies.js
function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
}

// could not import these types from ofetch, so copied them here
interface ResponseMap {
    blob: Blob;
    text: string;
    arrayBuffer: ArrayBuffer;
}
type ResponseType = keyof ResponseMap | 'json';

export type HttpOptions<R extends ResponseType> = FetchOptions<R> & {
    redirectIfNotAuthenticated?: boolean;
    redirectIfNotVerified?: boolean;
};

export async function $http<T, R extends ResponseType = 'json'>(
    path: RequestInfo,
    { redirectIfNotAuthenticated = true, redirectIfNotVerified = true, ...options }: HttpOptions<R> = {}
) {
    const router = useRouter();
    const config = useRuntimeConfig();

    let token = useCookie($X_TOKEN).value;

    // on client initiate a csrf request and get it from the cookie set by laravel
    if (import.meta.client) {
        // cannot use nuxt composables such as useCookie after an async operation:
        // https://github.com/nuxt/framework/issues/5238
        token = getCookie($X_TOKEN);
    }

    let headers: any = {
        accept: 'application/json',
        credentials: 'include',
        ...options?.headers,
        ...(token && { [$AUTH_HEADER]: `Bearer ${token}` })
    };

    if (import.meta.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie'])
        };
    }

    try {
        return await $fetch<T, R>(path, {
            baseURL: config.public.apiURL,
            ...options,
            headers
        });
    } catch (error) {
        if (!(error instanceof FetchError)) throw error;

        const status = error.response?.status ?? -1;

        if (redirectIfNotAuthenticated && [401, 419].includes(status)) {
            await router.push('/login');
        }

        if (redirectIfNotVerified && [409].includes(status)) {
            await router.push('/verify-email');
        }

        if ([500].includes(status)) {
            console.error('[Http Error]', error.data?.message);
        }

        throw error;
    }
}

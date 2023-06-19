import { $fetch, FetchError, FetchOptions } from 'ofetch';

export const $X_TOKEN = 'X-TOKEN';
const AUTH_HEADER = 'Authorization';

// could not import these types from ofetch, so copied them here
interface ResponseMap {
	blob: Blob;
	text: string;
	arrayBuffer: ArrayBuffer;
}
type ResponseType = keyof ResponseMap | 'json';
// end of copied types

export type HttpOptions<R extends ResponseType> = FetchOptions<R> & {
	redirectIfNotAuthenticated?: boolean;
	redirectIfNotVerified?: boolean;
};

export async function $http<T, R extends ResponseType = 'json'>(
	path: RequestInfo,
	{ redirectIfNotAuthenticated = true, redirectIfNotVerified = true, ...options }: HttpOptions<R> = {}
) {
	const config = useRuntimeConfig();
	const router = useRouter();

	let token = useCookie($X_TOKEN).value;

	// on client initiate a csrf request and get it from the cookie set by laravel
	if (process.client) {
		// cannot use nuxt composables such as useCookie after an async operation:
		// https://github.com/nuxt/framework/issues/5238
		token = getCookie($X_TOKEN);
	}

	let headers: any = {
		accept: 'application/json',
		...options?.headers,
		...(token && { [AUTH_HEADER]: `Bearer ${token}` })
	};

	if (process.server) {
		headers = {
			...headers,
			...useRequestHeaders(['cookie']),
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

		// when any of the following redirects occur and the final throw is not caught then nuxt SSR will log the following error:
		// [unhandledRejection] Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

		const status = error.response?.status ?? -1;

		if (redirectIfNotAuthenticated && [401, 419].includes(status)) {
			await router.push('/login');
		}

		if (redirectIfNotVerified && [409].includes(status)) {
			await router.push('/verify-email');
		}

		if ([500].includes(status)) {
			console.error('[Http Error]', error.data?.message, error.data);
		}

		throw error;
	}
}

// https://github.com/axios/axios/blob/bdf493cf8b84eb3e3440e72d5725ba0f138e0451/lib/helpers/cookies.js
function getCookie(name: string) {
	const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	return match ? decodeURIComponent(match[3]) : null;
}

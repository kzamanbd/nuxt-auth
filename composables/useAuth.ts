export type User = {
    name?: string;
    email?: string;
    image?: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type RegisterCredentials = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type ResetPasswordCredentials = {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
};

// Value is initialized in: ~/plugins/auth.ts
export const useUser = () => {
    return useState<User | undefined | null>('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();

    const user = useUser();
    const isLoggedIn = computed(() => !!user.value);
    const cookie = useCookie($X_TOKEN);

    async function refresh() {
        try {
            user.value = await fetchCurrentUser();
        } catch {
            user.value = null;
        }
    }

    async function login(credentials: LoginCredentials) {
        if (isLoggedIn.value) return;

        const response: any = await $request('/auth/login', { method: 'post', body: credentials });
        cookie.value = response.data?.token?.access_token; // set cookie
        return response;
    }

    async function register(credentials: RegisterCredentials) {
        const response: any = await $request('/auth/register', { method: 'post', body: credentials });
        cookie.value = response.token; // set cookie
        return response;
    }

    async function resendEmailVerification() {
        return await $request<{ status: string }>('/email/verification-notification', { method: 'post' });
    }

    async function logout() {
        if (!isLoggedIn.value) return;

        user.value = null;
        router.push('/login');
        await $request('/logout');
        cookie.value = null;
    }

    async function forgotPassword(email: string) {
        return await $request('/forgot-password', {
            method: 'post',
            body: { email }
        });
    }

    async function resetPassword(credentials: ResetPasswordCredentials) {
        return await $request('/auth/reset-password', {
            method: 'post',
            body: credentials
        });
    }

    return {
        user,
        isLoggedIn,
        login,
        register,
        resendEmailVerification,
        logout,
        forgotPassword,
        resetPassword,
        refresh
    };
};

export const fetchCurrentUser = async () => {
    try {
        return await $request<User>('/current-user', {
            redirectIfNotAuthenticated: false
        });
    } catch (error: any) {
        if ([401, 419].includes(error?.response?.status)) return null;
        console.error(error);
    }
};

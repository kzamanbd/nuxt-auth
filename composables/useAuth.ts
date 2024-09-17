export type User = {
    name: string;
    email?: string;
    photo?: string;
};

export type LoginResponse = {
    code: string;
    status: string;
    message: string;
    data: {
        user: User;
    };
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

// Value is initialized in: @/plugins/auth.ts
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

        const response: any = await $http('/auth/login', { method: 'post', body: credentials });
        cookie.value = response.data?.token?.access_token; // set cookie
        return response;
    }

    async function register(credentials: RegisterCredentials) {
        const response: any = await $http('/auth/register', { method: 'post', body: credentials });
        cookie.value = response.token; // set cookie
        return response;
    }

    async function resendEmailVerification() {
        return await $http<{ status: string }>('/email/verification-notification', { method: 'post' });
    }

    async function logout() {
        if (!isLoggedIn.value) return;

        user.value = null;
        router.push('/login');
        await $http('/logout');
        cookie.value = null;
    }

    async function forgotPassword(email: string) {
        return await $http('/forgot-password', {
            method: 'post',
            body: { email }
        });
    }

    async function resetPassword(credentials: ResetPasswordCredentials) {
        return await $http('/auth/reset-password', {
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
        const res = await $http<LoginResponse>('/current-user', {
            redirectIfNotAuthenticated: false
        });
        return res.data.user;
    } catch (error: any) {
        return null;
    }
};

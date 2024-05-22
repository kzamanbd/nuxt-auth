import { fetchCurrentUser, useUser } from '@/composables/useAuth';

export default defineNuxtPlugin(async () => {
    const user = useUser();

    // Skip if already initialized on server
    if (user.value !== undefined) return;
    const res = await fetchCurrentUser();
    user.value = res?.data.user;
});

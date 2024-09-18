import { fetchCurrentUser, useUser } from '@/composables/useAuth';

export default defineNuxtPlugin(async () => {
    const route = useRoute();
    if (route.path.startsWith('/v2')) return;

    const user = useUser();

    // Skip if already initialized on server
    if (user.value !== undefined) return;

    user.value = await fetchCurrentUser();
});

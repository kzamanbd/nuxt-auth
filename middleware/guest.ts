export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    if (user.value) return navigateTo('/v1/dashboard', { replace: true });
});

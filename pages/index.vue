<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="mb-8 text-4xl font-bold text-gray-800 dark:text-white">Let's Discuss. 💬</h1>
        <div class="space-x-4">
            <NuxtLink
                v-if="isLoggedIn"
                to="/dashboard"
                class="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Dashboard
            </NuxtLink>
            <NuxtLink
                v-else
                to="/login"
                class="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-25">
                Login
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>
    definePageMeta({ layout: 'guest' });
    useHead({
        title: "Let's Discuss"
    });
    const { isLoggedIn } = useAuth();
</script>

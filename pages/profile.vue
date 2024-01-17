<script setup>
    import DeleteUser from '@/components/shared/DeleteUser.vue';
    import UpdatePassword from '@/components/shared/UpdatePassword.vue';
    import UpdateProfile from '@/components/shared/UpdateProfile.vue';

    useHead({ title: 'Profile' });
    definePageMeta({ middleware: ['auth'] });
    const mustVerifyEmail = ref(false);
    const status = ref(null);
</script>

<template>
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <UpdateProfile :must-verify-email="mustVerifyEmail" :status="status" class="max-w-xl" />
            </div>

            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <UpdatePassword class="max-w-xl" />
            </div>

            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <DeleteUser class="max-w-xl" />
            </div>
        </div>
    </div>
</template>

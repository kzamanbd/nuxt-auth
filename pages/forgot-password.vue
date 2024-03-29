<script setup>
    useHead({ title: 'Forgot Password' });
    definePageMeta({ middleware: ['guest'], layout: 'guest' });
    const { forgotPassword } = useAuth();

    const email = ref('');
    const resetEmailSent = ref(false);
    const status = ref('');

    const {
        submit,
        isLoading,
        validationErrors: errors
    } = useSubmit(
        () => {
            status.value = '';
            return forgotPassword(email.value);
        },
        {
            onSuccess: (result) => {
                status.value = result?.status ?? '';
                resetEmailSent.value = true;
            }
        }
    );
</script>

<template>
    <AuthCard>
        <template #logo>
            <NuxtLink to="/">
                <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
            </NuxtLink>
        </template>

        <div class="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email address and we will email you a password reset
            link that will allow you to choose a new one.
        </div>

        <!-- Session Status -->
        <div v-if="status" class="mb-4 font-medium text-sm text-green-600">
            {{ status }}
        </div>

        <form @submit.prevent="submit">
            <!-- Email Address -->
            <div>
                <InputLabel for="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    class="block mt-1 w-full"
                    v-model="email"
                    :disabled="resetEmailSent"
                    required
                    autoFocus />
            </div>

            <div class="flex items-center justify-end mt-4">
                <PrimaryButton
                    class="ml-3"
                    :class="{ 'opacity-25': isLoading }"
                    :disabled="isLoading || resetEmailSent">
                    Email Password Reset Link
                </PrimaryButton>
            </div>
        </form>
    </AuthCard>
</template>

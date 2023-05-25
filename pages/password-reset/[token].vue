<script setup>
	definePageMeta({ middleware: ['guest'], layout: 'guest' });
	useHead({ title: 'Reset Password' });

	const router = useRouter();
	const route = useRoute();
	const { resetPassword } = useAuth();

	if (!route.query.email) {
		router.push('/');
	}

	const data = reactive({
		email: route.query.email,
		password: '',
		password_confirmation: ''
	});
	const token = computed(() => route.params.token);
	const {
		submit,
		isLoading,
		validationErrors: errors
	} = useSubmit(() => resetPassword({ token: token.value, ...data }), {
		onSuccess: (result) =>
			router.push({
				path: '/login',
				query: { reset: btoa(result?.status ?? '') }
			})
	});
</script>

<template>
	<AuthCard>
		<template #logo>
			<NuxtLink href="/">
				<ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
			</NuxtLink>
		</template>

		<form @submit.prevent="submit">
			<!-- Email Address -->
			<div class="mt-4">
				<InputLabel for="email" value="Email" />
				<TextInput
					id="email"
					type="email"
					class="block mt-1 w-full opacity-80"
					v-model="data.email"
					disabled
					required />
				<InputError class="mt-2" :message="errors?.email" />
			</div>

			<!-- Password -->
			<div class="mt-4">
				<InputLabel for="password" value="New Password" />
				<TextInput id="password" type="password" class="block mt-1 w-full" v-model="data.password" required />
				<InputError class="mt-2" :message="errors?.password" />
			</div>

			<!-- Confirm Password -->
			<div class="mt-4">
				<InputLabel for="password_confirmation" value="Confirm Password" />
				<TextInput
					id="password_confirmation"
					type="password"
					class="block mt-1 w-full"
					v-model="data.password_confirmation"
					required />
				<InputError class="mt-2" :message="errors?.password_confirmation" />
			</div>

			<div class="flex items-center justify-end mt-4">
				<PrimaryButton :class="{ 'opacity-25': isLoading }" :disabled="isLoading">
					Reset Password
				</PrimaryButton>
			</div>
		</form>
	</AuthCard>
</template>

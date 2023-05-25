<script setup>
	definePageMeta({ middleware: ['guest'] });
	useHead({ title: 'Register' });

	const router = useRouter();
	const { register } = useAuth();

	const form = reactive({
		name: '',
		email: '',
		password: '',
		password_confirmation: ''
	});

	const {
		submit,
		isLoading,
		validationErrors: errors
	} = useSubmit(() => register(form), {
		onSuccess: () => router.push('/dashboard'),
		onError: (error) => console.log(error)
	});
</script>

<template>
	<AuthCard>
		<template #logo>
			<NuxtLink to="/">
				<ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
			</NuxtLink>
		</template>
		<form @submit.prevent="submit">
			<div>
				<InputLabel for="name" value="Name" />

				<TextInput
					id="name"
					type="text"
					class="mt-1 block w-full"
					v-model="form.name"
					required
					autofocus
					autocomplete="name" />

				<InputError class="mt-2" :message="errors?.name" />
			</div>

			<div class="mt-4">
				<InputLabel for="email" value="Email" />

				<TextInput
					id="email"
					type="email"
					class="mt-1 block w-full"
					v-model="form.email"
					required
					autocomplete="username" />

				<InputError class="mt-2" :message="errors?.email" />
			</div>

			<div class="mt-4">
				<InputLabel for="password" value="Password" />

				<TextInput
					id="password"
					type="password"
					class="mt-1 block w-full"
					v-model="form.password"
					required
					autocomplete="new-password" />

				<InputError class="mt-2" :message="errors?.password" />
			</div>

			<div class="mt-4">
				<InputLabel for="password_confirmation" value="Confirm Password" />

				<TextInput
					id="password_confirmation"
					type="password"
					class="mt-1 block w-full"
					v-model="form.password_confirmation"
					required
					autocomplete="new-password" />

				<InputError class="mt-2" :message="errors?.password_confirmation" />
			</div>

			<div class="flex items-center justify-end mt-4">
				<NuxtLink
					to="/login"
					class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
					Already registered?
				</NuxtLink>

				<PrimaryButton class="ml-4" :class="{ 'opacity-25': isLoading }" :disabled="isLoading">
					Register
				</PrimaryButton>
			</div>
		</form>
	</AuthCard>
</template>

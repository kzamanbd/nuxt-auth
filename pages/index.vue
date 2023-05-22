<script setup>
	useHead({
		title: 'Login'
	});
	defineProps({
		canResetPassword: {
			type: Boolean
		},
		status: {
			type: String
		}
	});

	const form = ref({
		email: '',
		password: '',
		remember: false
	});

	const submit = () => {
		console.log(form.value);
	};
</script>

<template>
	<div v-if="status" class="mb-4 font-medium text-sm text-green-600">
		{{ status }}
	</div>

	<form @submit.prevent="submit">
		<div>
			<InputLabel for="email" value="Email" />

			<TextInput
				id="email"
				type="email"
				class="mt-1 block w-full"
				v-model="form.email"
				required
				autofocus
				autocomplete="username" />

			<InputError class="mt-2" :message="form.errors?.email" />
		</div>

		<div class="mt-4">
			<InputLabel for="password" value="Password" />

			<TextInput
				id="password"
				type="password"
				class="mt-1 block w-full"
				v-model="form.password"
				required
				autocomplete="current-password" />

			<InputError class="mt-2" :message="form.errors?.password" />
		</div>

		<div class="block mt-4">
			<label class="flex items-center">
				<Checkbox name="remember" v-model:checked="form.remember" />
				<span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
			</label>
		</div>

		<div class="flex items-center justify-end mt-4">
			<Link
				v-if="canResetPassword"
				:href="route('password.request')"
				class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
				Forgot your password?
			</Link>

			<PrimaryButton class="ml-4" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
				Log in
			</PrimaryButton>
		</div>
	</form>
</template>

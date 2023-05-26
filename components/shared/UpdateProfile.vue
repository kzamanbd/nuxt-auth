<script setup>
	defineProps({
		mustVerifyEmail: {
			type: Boolean,
			default: true
		},
		status: {
			type: String,
			default: null
		}
	});

	const { user } = useAuth();
	console.log(user);

	const form = reactive({
		name: user.value.name,
		email: user.value.email,
		errors: {}
	});
	const updateProfile = () => {
		console.log('updateProfile');
	};
</script>

<template>
	<section>
		<header>
			<h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Information</h2>

			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
				Update your account's profile information and email address.
			</p>
		</header>

		<form @submit.prevent="updateProfile" class="mt-6 space-y-6">
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
			</div>

			<div>
				<InputLabel for="email" value="Email" />

				<TextInput
					id="email"
					type="email"
					class="mt-1 block w-full"
					v-model="form.email"
					required
					autocomplete="username" />
			</div>

			<div v-if="mustVerifyEmail && user.email_verified_at === null">
				<p class="text-sm mt-2 text-gray-800 dark:text-gray-200">
					Your email address is unverified.
					<NuxtLink
						href="/verify-email"
						class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
						Click here to re-send the verification email.
					</NuxtLink>
				</p>

				<div
					v-show="status === 'verification-link-sent'"
					class="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
					A new verification link has been sent to your email address.
				</div>
			</div>

			<div class="flex items-center gap-4">
				<PrimaryButton>Save</PrimaryButton>
			</div>
		</form>
	</section>
</template>

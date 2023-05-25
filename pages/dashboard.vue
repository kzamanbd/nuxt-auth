<template>
	<div class="max-w-5xl mx-auto mt-5 px-1">
		<h3 class="text-xl font-bold">Authentication Overview</h3>
		<p class="text-sm mb-4">See all available authentication & session information below.</p>
		<pre class="pre-auth" v-if="status"><span>Status:</span> {{ status }}</pre>
		<pre class="pre-auth" v-if="user"><span>Data:</span> {{ user }}</pre>
		<AuthenticationStatus />
	</div>
</template>

<script setup>
	definePageMeta({ middleware: ['auth'], layout: 'auth' });

	useHead({
		title: 'Authentication Overview',
		description: 'See all available authentication & session information below.'
	});
	const { user } = useAuth();
	const status = computed(() => {
		if (user.value) {
			return 'authenticated';
		}
		return 'unauthenticated';
	});
</script>

<template>
	<div class="max-w-5xl mx-auto mt-5 px-1">
		<h3 class="text-xl font-bold">Authentication Overview</h3>
		<p class="text-sm mb-4">See all available authentication & session information below.</p>
		<AuthenticationStatus />
		<pre class="pre-auth" v-if="status"><span>Status:</span> {{ status }}</pre>
		<pre class="pre-auth" v-if="data"><span>Data:</span> {{ data }}</pre>
		<pre class="pre-auth" v-if="csrfToken"><span>CSRF Token:</span> {{ csrfToken }}</pre>
		<pre class="pre-auth" v-if="providers"><span>Providers:</span> {{ providers }}</pre>
	</div>
</template>

<script setup>
	definePageMeta({ auth: true, layout: 'auth' });

	useHead({
		title: 'Authentication Overview',
		description: 'See all available authentication & session information below.'
	});
	const { data, status, getCsrfToken, getProviders } = useSession();

	const providers = await getProviders();
	const csrfToken = await getCsrfToken();
</script>

<template>
   <main>Logging out...</main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { disconnectWallet } from '~/plugins/api/wallet/sdk';

const router = useRouter();
disconnectWallet().then(async () => {
   events.all.clear();

   await router.push('/login');
   window.location.reload();
});
</script>

<route>
   name: Logout
   meta:
      requiresAuth: true
</route>

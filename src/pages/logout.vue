<template>
   <main>Logging out...</main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import store from '~/plugins/store';

const router = useRouter();
store.value.isAuthorized = false;
router.push('/login');
</script>

<route>
   name: Logout
   meta:
      requiresAuth: true
</route>

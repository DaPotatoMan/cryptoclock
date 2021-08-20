<template>
   <router-view v-slot="{ Component, route }">
      <transition name="page-fade" mode="out-in">
         <component :is="Component" :key="route.path" />
      </transition>
   </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'App'
});
</script>

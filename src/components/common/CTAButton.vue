<template>
   <button class="cta-button" :class="{ loading, disabled }">
      <transition name="fade-slide-down" mode="out-in">
         <div v-if="loading"><Spinner class="cta-button--spinner" /></div>
         <div v-else class="cta-button--slot"><slot /></div>
      </transition>
   </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
   name: 'CTAButton',
   props: {
      loading: {
         type: Boolean,
         default: false,
      },

      disabled: {
         type: Boolean,
         default: false,
      },
   },
});
</script>

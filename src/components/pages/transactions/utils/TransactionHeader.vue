<template>
   <header class="view-header">
      <div v-if="canGoBack" class="view-header-icon" @click="nextStep(false)">
         <icon-mdi-keyboard-backspace />
      </div>

      <div class="view-header-content">
         <h1 class="view-header-content--title">{{ title }}</h1>
         <p class="view-header-content--subtitle">{{ subtitle }}</p>
      </div>
   </header>
</template>

<script lang="ts" setup>
defineProps({
   title: {
      type: String,
      default: ''
   },

   subtitle: {
      type: String,
      default: ''
   },

   canGoBack: {
      type: Boolean,
      default: true
   }
});

const nextStep = inject('nextStep') as any;
</script>

<style lang="postcss" scoped>
.view-header {
   @apply flex items-center;

   &-icon {
      @apply flex mr-5 cursor-pointer
      text-default/70 text-2xl
      transform hover:(text-default -translate-x-5px) active:scale-95;

      transition: all 200ms;
      transition-property: transform, color;
   }

   &-content {
      &--title {
         @apply mb-1 text-2xl font-medium;
      }

      &--subtitle {
         @apply text-base text-default/78;
      }
   }
}
</style>

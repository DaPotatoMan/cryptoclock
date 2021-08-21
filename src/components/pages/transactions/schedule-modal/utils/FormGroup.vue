<template>
   <fieldset class="form-group">
      <label class="form-group-label">{{ label }}</label>

      <div class="form-group-input-wrapper">
         <div class="form-group-input-icon">
            <slot name="icon" />
         </div>

         <slot class="form-group-input" />
         <div class="form-group-input-state" />
      </div>
   </fieldset>
</template>

<script lang="ts" setup>
defineProps({
   label: {
      type: String,
      default: ''
   }
});
</script>

<style lang="postcss">
.form-group {
   @apply flex flex-col overflow-hidden;

   &-label {
      @apply mb-1 text-base text-default/70;
   }

   &-input-wrapper {
      @apply relative flex items-center;
   }

   &-input-icon {
      @apply w-9 z-1
         flex flex-shrink-0 text-2xl;

      svg {
         @apply w-6;
      }
   }

   input {
      @apply w-full py-3 -ml-9 px-9
      outline-none text-xl;

      &:focus + .form-group-input-state::after {
         transform: translateX(0);
      }

      &:invalid:not(:placeholder-shown) + .form-group-input-state::after {
         @apply bg-red-500 transform-none;
      }

      /*
      &:valid + &-state::after {
         @apply bg-black/20 transform-none;
      }
      */
   }

   &-input-state {
      @apply absolute bottom-0 h-2px w-full
         bg-black/10;

      &::after {
         @apply h-full w-full content-''
            absolute bottom-0 left-0
            bg-accent;

         transform: translateX(-100%);
         transition: transform 350ms ease;
      }
   }
}
</style>

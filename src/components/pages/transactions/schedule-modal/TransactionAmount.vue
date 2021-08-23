<template>
   <form class="view-template" @submit.prevent="finishProcess">
      <TransactionHeader title="Transaction Amount" subtitle="Amount to be sent" />

      <div class="view-form">
         <button type="button" class="view-form-input-button" @click="amount--">
            <icon-ic-baseline-remove />
         </button>

         <FormGroup class="view-form-input-wrapper">
            <input
               v-model.number="amount"
               type="number"
               step="any"
               class="view-form-input"
            >
         </FormGroup>

         <button type="button" class="view-form-input-button" @click="amount++">
            <icon-ic-baseline-add />
         </button>
      </div>

      <CTAButton :disabled="amount <= 0" type="submit">Continue</CTAButton>
   </form>
</template>

<style lang="postcss" scoped>
.view-template {
   .view-form {
      @apply my-10 flex items-center;

      &-input {
         @apply w-full px-12 py-5 text-center
         text-5xl outline-none

         font-family: "Jetbrains Mono";
         -moz-appearance: textfield;

         &-wrapper {
            @apply -mx-10;
         }
      }

      &-input-button {
         @apply w-40px h-40px z-1 flex-shrink-0
         flex items-center justify-center outline-none
         text-2xl bg-gray-300 rounded-full shadow-md
         hover:bg-gray-400/60 active:(transform-gpu scale-96);

         transition: all 200ms;
         will-change: background-color, transform;
      }
   }
}
</style>

<script lang="ts" setup>
const amount = ref(5);
const emit = defineEmits(['finish']);

const finishProcess = () => {
   if (amount.value > 0) emit('finish', 'amount', amount.value);
};
</script>

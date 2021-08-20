<template>
   <div class="view-template">
      <TransactionHeader title="Transaction Date" subtitle="Schedule your transaction" />

      <Spinner v-if="!isActive" class="view-template-loader" />

      <date-picker
         v-show="isActive"
         v-model="datetime"
         class="view-template-datepicker"
         :min-date="new Date()"
         color="indigo"
         mode="datetime"
         title-position="left"
         trim-weeks
         is-expanded
      />

      <CTAButton :disabled="!isActive" @click="finishProcess">Continue</CTAButton>
   </div>
</template>

<style lang="postcss" scoped>
.view-template {
   &-loader {
      @apply m-auto;

      --spinner-size: 32px;
      --spinner-border-size: 3px;
      --spinner-color: rgb(105, 104, 221);
      will-change: transform;
   }

   :deep(&-datepicker) {
      @apply border-none;

      .vc-header {
         @apply pb-4 mb-3 border-b border-black/10;
      }
   }
}
</style>

<script lang="ts" setup>
import { onActivated, onDeactivated } from 'vue';

const isActive = ref(false);
const datetime = ref(new Date());
const emit = defineEmits(['finish']);

const finishProcess = () => {
   emit('finish', 'datetime', datetime.value);
};

onActivated(() => {
   setTimeout(() => requestAnimationFrame(() => {
      isActive.value = true;
   }), 1500);
});

onDeactivated(() => {
   isActive.value = false;
});
</script>

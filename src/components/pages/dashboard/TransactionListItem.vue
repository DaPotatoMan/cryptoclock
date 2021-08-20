<template>
   <div class="transaction-list-item">
      <div class="data-amount">{{ data.amount }}ꜩ</div>

      <div class="data-details">
         <span class="data-details-address">{{ data.recipientAddress || 'Unknown' }}</span>
         <span class="data-details-date">{{ getRelativeDate(data.datetime) }}</span>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { formatRelative } from 'date-fns';

defineProps({
   data: {
      type: Object as PropType<Transaction>,
      default: () => { }
   }
});

const baseDate = new Date();
const getRelativeDate = (date: string) => formatRelative(new Date(date), baseDate);
</script>

<style lang="postcss">
.transaction-list-item {
   @apply px-6 py-5 flex items-center;

   &:not(:last-of-type) {
      border-bottom: 1px dashed rgba(0, 0, 0, 0.085);
   }

   .data-amount {
      @apply mr-6 text-2xl font-medium;
   }

   .data-details {
      @apply flex flex-col
      break-all;

      &-date {
         @apply text-sm text-default/70 first-letter:capitalize;
      }
   }
}
</style>

<template>
   <tr class="transaction-list-item">
      <td class="data-amount">{{ data.amount }}ꜩ</td>
      <td class="data-fee">{{ data.fee }}ꜩ</td>
      <td class="data-address">{{ data.recipientAddress || 'Unknown' }}</td>
      <td class="data-date">{{ getRelativeDate(data.datetime) }}</td>
      <td class="data-status">
         <span
            class="data-status-badge"
            :class="{ warning: !data.completed }"
         >{{ data.completed ? 'Completed' : 'Pending' }}</span>
         <span v-if="isOverdue" class="data-status-badge critical">Overdue</span>
      </td>
   </tr>
</template>

<script lang="ts" setup>
import { formatRelative } from 'date-fns';

const props = defineProps({
   data: {
      type: Object as PropType<Transaction>,
      default: () => { }
   }
});

const baseDate = new Date();
const isOverdue = !props.data.completed && props.data.datetime < baseDate;
const getRelativeDate = (date: Date) => formatRelative(new Date(date), baseDate);
</script>

<style lang="postcss">
.transaction-list-item {
   @apply text-default/80;

   &:not(:last-of-type) {
      border-bottom: 1px dashed rgba(0, 0, 0, 0.085);
   }

   .data {
      &-amount {
         @apply mr-6 text-xl font-medium;
      }

      &-address {
         @apply md:break-all
         <md:(max-w-50px overflow-hidden overflow-ellipsis);
      }

      &-date {
         @apply first-letter:capitalize;
      }

      &-status {
         &-badge {
            @apply px-3 py-1 not-first-of-type:ml-2
            rounded-full bg-teal-500/20 text-teal-600;

            &.warning {
               @apply bg-orange-500/18 text-orange-600;
            }

            &.critical {
               @apply bg-red-500/20 text-red-600;
            }
         }
      }
   }
}
</style>

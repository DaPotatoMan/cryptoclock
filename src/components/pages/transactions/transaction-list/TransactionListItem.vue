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

      <td v-if="!data.completed && data.isOwn" class="data-action">
         <CTAButton :loading="isCancelling" class="data-action-button" @click="invokeCancel">
            <icon-ic-baseline-cancel />
         </CTAButton>
      </td>
   </tr>
</template>

<script lang="ts" setup>
import { formatRelative } from 'date-fns';
import { cancelTransaction } from '~/plugins/api/transactions';

const props = defineProps({
   data: {
      type: Object as PropType<Transaction>,
      default: () => { }
   }
});

const baseDate = new Date();
const isOverdue = !props.data.completed && props.data.datetime < baseDate;
const getRelativeDate = (date: Date) => formatRelative(new Date(date), baseDate);

const isCancelling = ref(false);
const invokeCancel = () => {
   isCancelling.value = true;
   cancelTransaction(props.data).catch((error) => {
      console.error(error);
      isCancelling.value = false;
   });
};
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

      &-action-button {
         @apply w-42px h-42px
         text-default bg-default rounded-full
         outline-none active:(transform scale-97);

         &.loading {
            @apply bg-red-500/15;
         }

         svg {
            @apply w-20px h-20px;
         }

         --spinner-color: red;
         transition: all 200ms ease;
         transition-property: background-color, transform;
      }
   }
}
</style>

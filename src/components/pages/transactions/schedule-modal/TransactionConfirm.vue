<template>
   <div class="view-template">
      <TransactionHeader title="Confirm" subtitle="It doesn't hurt to make sure 😉" />

      <ul class="view-template-data">
         <li class="data-item">
            <span class="data-item-label">Address</span>
            <span class="data-item-value">{{ data.recipientAddress }}</span>
         </li>
         <li class="data-item">
            <span class="data-item-label">Date</span>
            <span class="data-item-value">{{ data.datetime.toUTCString() }}</span>
         </li>
         <li class="data-item">
            <span class="data-item-label">Amount</span>
            <span class="data-item-value">{{ data.amount }}ꜩ</span>
         </li>

         <hr class="data-item-divider">

         <li class="data-item">
            <span class="data-item-label">Fees</span>
            <span class="data-item-value">{{ amount.fee }}ꜩ</span>
         </li>
         <li class="data-item">
            <span class="data-item-label">Total amount</span>
            <span class="data-item-value">{{ amount.total }}ꜩ</span>
         </li>
      </ul>

      <CTAButton :loading="isProcessing" @click="schedule">Continue</CTAButton>
   </div>
</template>

<style lang="postcss" scoped>
.view-template {
   &-data {
      .data-item {
         @apply mb-4 flex justify-between
         text-base;

         &-label {
            @apply font-medium;
         }

         &-value {
            @apply py-1 -my-1 max-w-200px
            overflow-hidden overflow-ellipsis;
         }

         &-divider {
            @apply mb-4
            border-1 border-dashed;
         }
      }
   }
}
</style>

<script lang="ts" setup>
import { PropType } from 'vue';
import { estimateFee, scheduleTransaction } from '~/plugins/api/transactions';

const props = defineProps({
   data: {
      type: Object as PropType<TransactionData>,
      default: () => { }
   }
});

const isProcessing = ref(false);

const amount = computed(() => {
   const { amount: value } = props.data;
   const fee = estimateFee(value);
   const total = fee + value;

   return { fee, total };
});

// Methods
const showModal = inject('showModal');
const schedule = async () => {
   isProcessing.value = true;

   await scheduleTransaction({ ...props.data, fee: amount.value.fee })
      .then(() => showModal(false))
      .catch(console.error);

   isProcessing.value = false;
};
</script>

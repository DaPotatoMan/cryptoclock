<template>
   <CTAButton
      v-if="pending && pending.length > 0"
      :loading="isProcessing"
      :disabled="!canRunTransactions"
      @click="processTransactions"
   >
      Run Transactions ({{ pending.length }})
   </CTAButton>
</template>

<script lang="ts" setup>
import { getCachedTransactions, runTransactions } from '~/plugins/api/transactions';

const rewards = ref(0);
const pending = ref(null as Transactions | null);
const canRunTransactions = ref(false);
const isProcessing = ref(false);

// Methods
const updateData = () => {
   const data = getCachedTransactions();

   if (data?.pending) {
      rewards.value = 0;
      pending.value = data.pending;
      canRunTransactions.value = false;

      data.pending.forEach((entry) => {
         rewards.value += entry.fee;

         if (entry.datetime <= new Date()) {
            canRunTransactions.value = true;
         }
      });
   }
};

const processTransactions = async () => {
   isProcessing.value = true;
   await runTransactions();
   isProcessing.value = false;
};

// Events
events.on('transactions-updated', updateData);
onUnmounted(() => events.off('transactions-updated', updateData));
</script>

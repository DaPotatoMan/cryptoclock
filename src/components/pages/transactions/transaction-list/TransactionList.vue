<template>
   <TransactionListEdgecase v-if="edgecase" :code="edgecase" />

   <div v-else-if="data" class="transaction-list-wrapper">
      <table class="transaction-list">
         <thead class="transaction-list-header">
            <tr>
               <th>Amount</th>
               <th>Fee</th>
               <th>Recipient</th>
               <th>Date</th>
               <th>Status</th>
            </tr>
         </thead>

         <tbody>
            <TransactionListItem
               v-for="(transaction, index) in data"
               :key="index"
               :data="transaction"
               class="transaction-list-item"
            />
         </tbody>
      </table>
   </div>
</template>

<script lang="ts" setup>
const props = defineProps({
   data: {
      type: Array as PropType<Transactions | null>,
      default: null
   }
});

const edgecase = computed(() => {
   const { data } = props;

   if (data === null) return 'loading';
   if (data?.length <= 0) return 'no-data';
   return false;
});
</script>

<style lang="postcss">
.transaction-list {
   @apply w-full min-w-600px relative overflow-hidden
      bg-default-elevated rounded-md shadow-sm;

   &-wrapper {
      @apply pb-5 mt-10 overflow-x-auto
      scrollbar-thin;
   }

   &-header {
      th {
         @apply py-5 px-6
         text-left text-base font-medium;
      }
   }

   &-item {
      td {
         @apply px-6 py-5;
      }
   }
}
</style>

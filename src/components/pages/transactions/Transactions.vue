<template>
   <section class="view-transactions">
      <TransactionActions />
      <TransactionList :data="transactions" />
   </section>
</template>

<script lang="ts" setup>
import { getTransactions } from '~/plugins/api/transactions';

const transactions = ref(null as null | Transactions);

let updateTimerId: NodeJS.Timeout;
const updateList = async () => {
   const data = await getTransactions();
   transactions.value = data?.all;
   updateTimerId = setTimeout(updateList, 2000);
};

updateList();
onUnmounted(() => clearTimeout(updateTimerId));
</script>

<style lang="postcss">
.view-transactions {
   @apply flex flex-col flex-grow;
}
</style>

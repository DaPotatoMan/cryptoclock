<template>
   <section class="transaction-list">
      <header class="transaction-list-header">
         <div class="header-content">
            <h1 class="header-content-title">Your Transactions</h1>
            <p
               class="header-content-subtitle"
            >
               All of your pending/processed transactions in one place.
            </p>
         </div>

         <div class="header-actions">
            <CTAButton @click="transactionModal.showModal()">
               <icon-ic-baseline-add />Schedule
            </CTAButton>
         </div>
      </header>
   </section>

   <Spinner v-if="isLoading" class="transaction-list-loader" />
   <div v-else-if="list" class="transaction-list-items">
      <TransactionListItem
         v-for="(transaction, index) in list"
         :key="index"
         class="list-complete-item"
         :data="transaction"
      />
   </div>

   <ScheduleTransaction ref="transactionModal" />
</template>

<script lang="ts" setup>
import { getTransactions } from '~/plugins/api/transactions';

const transactionModal = ref();
const isLoading = ref(true);
const list = ref([] as Transactions);

let updateListTimer: NodeJS.Timeout;
const updateList = async () => {
   await getTransactions().then((data) => {
      list.value = data.all;
      updateListTimer = setTimeout(updateList, 2000);
   });
   isLoading.value = false;
};

updateList();
onUnmounted(() => clearTimeout(updateListTimer));
</script>

<style lang="postcss">
.transaction-list {
   &-header {
      @apply flex justify-between items-center;

      .header-content {
         &-title {
            @apply mb-1 font-medium text-[18px] sm:text-xl;
         }

         &-subtitle {
            @apply <sm:hidden text-default/60;
         }
      }

      .header-actions {
         .cta-button {
            @apply text-default bg-default-elevated shadow-sm
            active:(transform scale-97);

            svg {
               @apply h-auto w-20px mr-1;
            }

            transition: transform 200ms;
         }
      }
   }

   &-loader {
      @apply m-auto;

      --spinner-color: rgb(105, 104, 221);
      --spinner-size: 34px;
      --spinner-border-size: 3px;
   }

   &-items {
      @apply relative my-10 overflow-hidden
      bg-default-elevated rounded-md shadow-sm;
   }
}
</style>

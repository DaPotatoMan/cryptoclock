<template>
   <div class="view-transaction-actions">
      <div class="header-content">
         <h1 class="header-content-title">Transaction History</h1>
         <p class="header-content-subtitle">Globally processed/pending transactions.</p>
      </div>

      <div class="header-actions">
         <RunTransactions />
         <CTAButton @click="scheduleModal.showModal()">
            <icon-ic-baseline-add />Schedule
         </CTAButton>
      </div>
   </div>

   <ScheduleTransaction ref="scheduleModal" />
</template>

<script lang="ts" setup>
const scheduleModal = ref();
</script>

<style lang="postcss">
.view-transaction-actions {
   @apply flex flex-wrap justify-between items-center
   <md:(flex-col items-start);

   .header-content {
      @apply <md:mb-10;

      &-title {
         @apply mb-1 font-medium text-xl;
      }

      &-subtitle {
         @apply text-default/60;
      }
   }

   .header-actions {
      @apply flex flex-shrink-0
      <md:ml-auto;

      .cta-button {
         @apply text-default bg-default-elevated shadow-sm
         not-first-of-type:ml-3
         active:(transform scale-97);

         svg {
            @apply h-auto w-20px mr-1;
         }

         &.disabled {
            @apply !bg-inverse/5;
         }

         transition: transform 200ms;
         --spinner-color: #6968dd;
      }
   }
}
</style>

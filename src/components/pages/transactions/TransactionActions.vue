<template>
   <div class="view-transaction-actions">
      <div class="header-content">
         <h1 class="header-content-title">Transaction History</h1>
         <p class="header-content-subtitle">Globally processed/pending transactions.</p>
      </div>

      <div class="header-actions">
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
</style>

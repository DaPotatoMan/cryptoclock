<template>
   <div class="transaction-list-edgecase">
      <transition name="fade" mode="out-in">
         <div v-if="code === 'loading'">
            <Spinner class="edgecase-loader" />
         </div>

         <div v-else-if="code === 'no-data'">
            <img
               class="edgecase-artwork"
               src="@assets/drawable/artworks/savings.svg"
               draggable="false"
            >
            <h1 class="edgecase-label">You have no transactions scheduled</h1>
         </div>
      </transition>
   </div>
</template>

<style lang="postcss">
.transaction-list-edgecase {
   @apply m-auto flex flex-col items-center;

   & > div {
      @apply flex flex-col items-center;
   }

   .edgecase {
      &-loader {
         @apply m-auto;

         --spinner-color: rgb(105, 104, 221);
         --spinner-size: 34px;
         --spinner-border-size: 3px;
      }

      &-artwork {
         @apply mb-10 w-[80%] max-w-400px;
      }

      &-label {
         @apply text-center text-base sm:text-xl font-medium;
      }
   }
}
</style>

<script lang="ts" setup>
defineProps({
   code: {
      type: String as PropType<'loading' | 'no-data' | false>,
      default: 'loading'
   }
});
</script>

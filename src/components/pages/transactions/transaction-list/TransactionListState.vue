<template>
   <div class="transaction-list-state">
      <img
         class="transaction-list-state-artwork"
         src="@assets/drawable/artworks/savings.svg"
         draggable="false"
      >
      <h1 class="transaction-list-state-label">You have no transactions scheduled</h1>
   </div>
</template>

<style lang="postcss">
.transaction-list-state {
   @apply m-auto flex flex-col items-center;

   &-artwork {
      @apply mb-10 w-[80%] max-w-400px;
   }

   &-label {
      @apply text-center text-base sm:text-xl font-medium;
   }
}
</style>

<template>
   <div ref="root" class="view-dashboard-header" :class="{ isScrollTop }">
      <div class="header-brand">
         <img class="header-brand-logo" draggable="false" src="/logo.png">
         <h1 class="header-brand-label">CryptoClock.</h1>
      </div>

      <div class="header-actions">
         <button class="header-actions-button" @click="switchTheme">Theme</button>

         <router-link to="/logout">
            <button class="header-actions-button">Log out</button>
         </router-link>
      </div>
   </div>
</template>

<style lang="postcss">
.view-dashboard-header {
   @apply !-mt-2 !mb-10 py-3 px-6 -m-6 sm:(px-10 -m-10) lg:(px-12 -m-12)
   flex flex-wrap gap-y-5 sticky top-0 left-0 z-1
   items-center justify-between;

   transition: background-color 150ms ease-out;

   &:not(.isScrollTop) {
      @apply bg-default-elevated shadow-sm;
   }

   .header-brand {
      @apply flex items-center;

      &-logo {
         @apply w-42px mr-5;
      }

      &-label {
         @apply text-[18px] font-medium;
         font-family: "Jetbrains Mono";
      }
   }

   .header-actions {
      @apply flex items-center ml-auto;

      &-button {
         @apply flex ml-5 outline-none
         text-base text-default/70 font-medium
         active:(transform scale-98);

         svg {
            @apply h-24px w-24px object-cover;
         }
      }
   }
}
</style>

<script lang="ts" setup>
const root = ref();
const isScrollTop = ref(true);

const updateScroll = () => {
   const rect = root.value.getBoundingClientRect() as ClientRect;
   isScrollTop.value = rect.top !== 0;
};

onMounted(() => {
   window.addEventListener('scroll', updateScroll);
});

onUnmounted(() => {
   window.removeEventListener('scroll', updateScroll);
});

const switchTheme = () => {
   document.documentElement.classList.toggle('theme-dark');
};
</script>

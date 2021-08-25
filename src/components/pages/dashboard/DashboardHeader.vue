<template>
   <div ref="root" class="view-dashboard-header" :class="{ isScrollTop }">
      <div class="header-brand">
         <img class="header-brand-logo" draggable="false" src="/assets/icons/logo.png">
         <h1 class="header-brand-label">CryptoClock.</h1>
      </div>

      <div class="header-actions">
         <button class="header-actions-button" @click="switchTheme()">
            <icon-ic-sharp-light-mode v-if="store.darkTheme" />
            <icon-ic-sharp-dark-mode v-else />Theme
         </button>

         <router-link to="/logout" draggable="false">
            <button class="header-actions-button">
               <icon-ic-baseline-logout />Log out
            </button>
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
         @apply flex ml-5 gap-x-2 outline-none
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
import store from '~/plugins/store';

const root = ref();
const isScrollTop = ref(true);

// Methods
const updateScroll = () => {
   const rect = root.value.getBoundingClientRect() as ClientRect;
   isScrollTop.value = rect.top !== 0;
};

const switchTheme = (firstLoad = false) => {
   const { classList } = document.documentElement;

   if (firstLoad) {
      classList.toggle('theme-dark', store.value.darkTheme);
   } else {
      const state = classList.toggle('theme-dark');
      store.value.darkTheme = state;
   }
};

// Events
switchTheme(true);
onMounted(() => window.addEventListener('scroll', updateScroll));
onUnmounted(() => window.removeEventListener('scroll', updateScroll));
</script>

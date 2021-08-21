<route>
   name: Login
   meta:
      requiresAuth: false
</route>

<template>
   <main class="view-login">
      <header class="view-login-header">
         <h1 class="header-label">CryptoClock.</h1>

         <ul class="header-links">
            <li class="header-links-item">Contact Us</li>
            <li class="header-links-item">About</li>
         </ul>
      </header>

      <section class="view-login-content">
         <h1 class="content-title">Connect Your Wallet</h1>
         <p class="content-subtitle">Connect your favorite wallet and start using CryptoClock!</p>
         <CTAButton :loading="isLoggingIn" class="content-cta" @click="login">Connect wallet</CTAButton>
      </section>
   </main>
</template>

<style lang="postcss">
html.theme-dark .view-login {
   background-image: url(@assets/drawable/backgrounds/bg-dark.svg);
}

.view-login {
   background: url(@assets/drawable/backgrounds/bg.svg) no-repeat center center fixed;
   background-size: cover;

   &-header {
      @apply py-5 px-6 -mx-6 -mt-5
      flex sticky top-0 z-2;

      .header-label {
         @apply font-semibold;

         font-family: "Jetbrains Mono";
      }

      .header-links {
         @apply ml-auto;

         &-item {
            @apply inline-block ml-5 cursor-pointer
            underline underline-2 underline-transparent underline-offset-14
            hover:(underline-black underline-offset-8);

            transition: all 250ms ease;
            transition-property: color, text-decoration, text-underline-offset;
         }
      }
   }

   &-content {
      @apply w-full max-w-550px px-8 py-10 m-auto
      flex flex-col items-center justify-center overflow-hidden
      bg-default-elevated shadow-sm rounded-lg;

      .content-title {
         @apply mb-3 text-center text-2xl font-semibold
         sm:(mb-5 text-3xl font-bold) xl:text-3xl;
      }

      .content-subtitle {
         @apply text-center leading-relaxed
         text-default/60 text-[18px] <sm:text-base;
      }

      .content-cta {
         @apply w-full max-w-70 mt-15 p-2.5 <sm:py-2
         text-white text-base rounded-lg shadow-md;

         background-image: linear-gradient(
            to right,
            #ff512f 0%,
            #dd2476 51%,
            #ff512f 100%
         );
         background-size: 200% auto;
         transition: background-position 500ms, transform 150ms;

         &:hover {
            background-position: right center;
         }

         &:active {
            transform: scale(0.99);
         }
      }
   }
}
</style>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import store from '~/plugins/store';
import { connectWallet, isWalletConnected } from '~/plugins/api/wallet/sdk';

const router = useRouter();
const isLoggingIn = ref(false);

const login = async () => {
   isLoggingIn.value = true;

   let isConnected = await isWalletConnected();

   if (!isConnected) {
      await connectWallet()
         .then(() => {
            isConnected = true;
         })
         .catch(console.error);
   }

   store.value.isAuthorized = isConnected;
   if (isConnected) await router.push('/');
   isLoggingIn.value = false;
};
</script>

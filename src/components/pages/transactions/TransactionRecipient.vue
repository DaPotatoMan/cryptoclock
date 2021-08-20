<template>
   <div class="view-template">
      <TransactionHeader title="Recipient Address" :can-go-back="false" />

      <FormGroup class="view-template-section">
         <input v-model="address" placeholder="Enter user address" class="form-group-input">
         <template #icon>
            <icon-fa-solid-address-card />
         </template>
      </FormGroup>

      <CTAButton :disabled="!isAddressValid" @click="finishProcess">Continue</CTAButton>
   </div>
</template>

<style lang="postcss" scoped>
.view-template {
   &-section {
      @apply my-10;
   }

   .form-group-input {
      @apply text-center;
   }
}
</style>

<script lang="ts" setup>
import { validateAddress } from '~/plugins/api/wallet/sdk';

const emit = defineEmits(['finish']);

const address = ref('');
const isAddressValid = computed(() => validateAddress(address.value));

const finishProcess = () => {
   if (!isAddressValid.value) return;
   emit('finish', 'recipientAddress', address.value);
};
</script>

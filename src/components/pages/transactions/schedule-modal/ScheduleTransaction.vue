<template>
   <Modal
      ref="modalRef"
      v-model="view.active"
      class="schedule-transction"
      @closed="reset"
   >
      <transition :name="view.transitionName" mode="out-in">
         <keep-alive>
            <TransactionRecipient v-if="view.step === 0" @finish="updateData" />
            <TransactionAmount v-else-if="view.step === 1" @finish="updateData" />
            <TransactionDate v-else-if="view.step === 2" @finish="updateData" />
            <TransactionConfirm v-else :data="transactionData" />
         </keep-alive>
      </transition>
   </Modal>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const currentStep = computed(() => router.currentRoute.value.query.step);
const modalRef = ref();

// Data
const view = reactive({
   active: false,
   step: 0,
   transitionName: 'slide-left'
});

const transactionData = reactive({
   fee: 0,
   amount: 0,
   datetime: new Date(),
   recipientAddress: ''
});

// Methods
const nextStep = (next = true) => {
   view.transitionName = next ? 'slide-left' : 'slide-right';

   if (next) view.step++;
   else view.step--;

   if (view.step < 0) view.step = 0;

   router.push({
      path: router.currentRoute.value.path,
      query: {
         step: view.step
      },
   });
};

const updateData = (key: string, value: any) => {
   Object.assign(transactionData, { [key]: value });
   nextStep();
};

const showModal = (state = true) => {
   view.active = state;
   view.step = -1;
   nextStep();
};

const reset = () => {
   view.step = -1;
   router.replace({ query: undefined });
};

// Other
watch(() => currentStep.value, (value) => {
   if (value === undefined) {
      modalRef.value.closeModal();
   } else {
      const step = Number(value);

      if (step !== view.step) nextStep(step > view.step);
   }
});

provide('nextStep', nextStep);
provide('showModal', showModal);
defineExpose({ showModal, data: transactionData });
</script>

<style lang="postcss">
.schedule-transction {
   .modal-wrapper-slot {
      @apply px-7 py-2-6 w-400px
      flex flex-col overflow-x-hidden overflow-y-auto scrollbar-thin;
   }

   .view-template {
      @apply flex-grow flex flex-col justify-between;
   }
}
</style>

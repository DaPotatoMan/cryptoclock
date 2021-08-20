<template>
   <transition name="fade" mode="out-in">
      <div v-if="modelValue" class="modal-wrapper">
         <div class="modal-wrapper-overlay" @click.self="closeModal" />
         <div class="modal-wrapper-slot">
            <slot v-bind="{ closeModal }" />
         </div>
      </div>
   </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
   modelValue: {
      type: Boolean,
      default: false
   }
});
const emit = defineEmits(['update:modelValue', 'closed']);

// Methods
const updateState = (state: boolean) => emit('update:modelValue', state);
const closeModal = () => {
   updateState(false);
   emit('closed');
};

provide('closeModal', closeModal);
defineExpose({ closeModal });
watch(() => props.modelValue, (state) => {
   document.documentElement.classList.toggle('no-scroll', state);
});
</script>

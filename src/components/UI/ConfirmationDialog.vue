<template>
    <dialog ref="dialog" class="confirmation-dialog">
      <div class="dialog-content">
        <p>{{ message }}</p>
        <div class="dialog-actions">
          <button @click="onCancel" :disabled="isSubmitting">
            {{ cancelText }}
          </button>
          <button 
            @click="onConfirm" 
            :disabled="isSubmitting"
            :class="{ 'is-loading': isSubmitting }"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </dialog>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      default: 'Are you sure?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    }
  });
  
  const emit = defineEmits(['confirm', 'cancel']);
  
  const dialog = ref(null);
  const isSubmitting = ref(false);
  
  const show = () => {
    dialog.value?.showModal();
  };
  
  const hide = () => {
    dialog.value?.close();
  };
  
  const onConfirm = async () => {
    isSubmitting.value = true;
    try {
      await emit('confirm');
      hide();
    } finally {
      isSubmitting.value = false;
    }
  };
  
  const onCancel = () => {
    emit('cancel');
    hide();
  };
  
  // Expose methods to parent component
  defineExpose({ show, hide });
  </script>
  
  <style scoped>
  .confirmation-dialog {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0;
    max-width: 90%;
    width: 400px;
    background: white;
  }
  
  .confirmation-dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  
  .dialog-content {
    padding: 1.5rem;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  
  button:first-child {
    background: #f5f5f5;
    border: 1px solid #ddd;
  }
  
  button:last-child {
    background: #007bff;
    color: white;
    border: none;
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .is-loading {
    position: relative;
    color: transparent;
  }
  
  .is-loading::after {
    content: '';
    position: absolute;
    width: 1rem;
    height: 1rem;
    top: 50%;
    left: 50%;
    margin: -0.5rem 0 0 -0.5rem;
    border: 2px solid white;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>
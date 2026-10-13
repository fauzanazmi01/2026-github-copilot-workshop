<template>
  <div class="card-panel">
    <p class="form-section-title">PO Header</p>
    <div class="form-row">
      <div class="form-group">
        <label>Vendor</label>
        <input 
          v-model="modelValue.vendor" 
          @update:model-value="updateField('vendor', $event)"
          placeholder="Type..." 
        />
      </div>
      <div class="form-group">
        <label>Needed By date</label>
        <div class="date-input-wrapper">
          <input 
            v-model="modelValue.neededByDate" 
            @update:model-value="updateField('neededByDate', $event)"
            type="date"
            placeholder="Select"
          />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>
      <div class="form-group">
        <label>Currency</label>
        <select v-model="modelValue.currency" @update:model-value="updateField('currency', $event)">
          <option value="">Select currency</option>
          <option value="IDR">IDR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div class="form-group">
        <label>Payment Terms</label>
        <input 
          v-model="modelValue.paymentTerms" 
          @update:model-value="updateField('paymentTerms', $event)"
          placeholder="Type..." 
        />
      </div>
    </div>
    <div class="form-group full">
      <label>Notes</label>
      <textarea 
        v-model="modelValue.notes" 
        @update:model-value="updateField('notes', $event)"
        placeholder="Type..." 
        rows="3" 
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      vendor: '',
      neededByDate: '',
      currency: 'IDR',
      paymentTerms: '',
      notes: '',
    }),
  },
});

const emit = defineEmits(['update:modelValue']);

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  });
};
</script>

<style scoped>
.date-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input-wrapper input {
  flex: 1;
  padding-right: 36px;
}

.date-input-wrapper svg {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: var(--text-muted);
}

select {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-input);
  padding: 10px 16px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text);
}

select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.1);
}
</style>

<template>
  <section>
    <!-- Page header -->
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/" class="back-btn" title="Back to dashboard">←</RouterLink>
        <div>
          <h2>Create Purchase Order</h2>
          <p class="muted">Pick approved PR lines and allocate order quantities</p>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <form @submit.prevent="handleSubmit">
      <!-- PO Header card -->
      <POHeaderForm v-model="form.header" />

      <!-- Approved PR Lines table -->
      <POLineAllocationTable 
        :approved-lines="approvedLines"
        @update:lines="handleLinesUpdate"
        @refresh="refreshOpenLines"
      />

      <!-- Summary section -->
      <div class="summary-row">
        <div class="summary-item">
          <p class="summary-label">Selected Lines</p>
          <p class="summary-value">{{ selectedLinesCount }}</p>
        </div>
        <div class="summary-item text-right">
          <p class="summary-label">Estimated Total</p>
          <p class="summary-value">{{ formatCurrency(estimatedTotal) }}</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="btn-group">
        <RouterLink to="/" class="btn btn-outline">Cancel</RouterLink>
        <button type="button" class="btn btn-secondary" @click="saveDraft" :disabled="isSubmitting">
          Save As Draft
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting || selectedLinesCount === 0">
          {{ isSubmitting ? 'Submitting...' : 'Submit PO' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import POHeaderForm from '../components/POHeaderForm.vue';
import POLineAllocationTable from '../components/POLineAllocationTable.vue';

const router = useRouter();
const errorMessage = ref('');
const isSubmitting = ref(false);

// Form state
const form = reactive({
  header: {
    vendor: '',
    neededByDate: '',
    currency: 'IDR',
    paymentTerms: '',
    notes: '',
  },
});

// Mock approved PR lines (would come from API)
const approvedLines = ref([
  {
    prNumber: 'PR-001',
    prLine: 1,
    itemCode: 'ITEM-001',
    itemName: 'Bearing-6205',
    uom: 'PCS',
    requestedQty: 20,
    allocatedQty: 5,
    remainingQty: 15,
  },
  {
    prNumber: 'PR-001',
    prLine: 2,
    itemCode: 'ITEM-009',
    itemName: 'Grease High Temp',
    uom: 'TUBE',
    requestedQty: 12,
    allocatedQty: 0,
    remainingQty: 12,
  },
  {
    prNumber: 'PR-004',
    prLine: 1,
    itemCode: 'ITEM-015',
    itemName: 'Bearing-6205',
    uom: 'PAR',
    requestedQty: 50,
    allocatedQty: 10,
    remainingQty: 40,
  },
]);

// Allocation state
const allocationState = reactive({
  selectedLines: [],
  lines: [],
});

const handleLinesUpdate = (update) => {
  allocationState.selectedLines = update.selectedLines;
  allocationState.lines = update.lines;
};

const selectedLinesCount = computed(() => allocationState.selectedLines.length);

const estimatedTotal = computed(() => {
  return allocationState.selectedLines.reduce((total, index) => {
    const line = allocationState.lines[index];
    if (line) {
      return total + (line.orderQty * line.unitPrice);
    }
    return total;
  }, 0);
});

const refreshOpenLines = () => {
  errorMessage.value = '';
  // In a real app, this would fetch fresh approved lines from API
  // For now, just clear selections
  allocationState.selectedLines = [];
};

const saveDraft = async () => {
  if (!form.header.vendor) {
    errorMessage.value = 'Vendor is required';
    return;
  }

  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save PO as draft
    // const response = await api.post('/api/purchase-orders', {
    //   status: 'DRAFT',
    //   header: form.header,
    //   lines: buildPoLines(),
    // });
    console.log('PO saved as draft:', {
      status: 'DRAFT',
      header: form.header,
      lines: buildPoLines(),
    });
    // Redirect to PO detail or list
    // await router.push(`/purchase-orders/${response.id}`);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to save draft';
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.header.vendor) {
    errorMessage.value = 'Vendor is required';
    return;
  }

  if (selectedLinesCount.value === 0) {
    errorMessage.value = 'Please select at least one line to allocate';
    return;
  }

  // Validate order quantities
  const invalidLines = allocationState.selectedLines.filter(index => {
    const line = allocationState.lines[index];
    return !line || !line.orderQty || line.orderQty <= 0;
  });

  if (invalidLines.length > 0) {
    errorMessage.value = 'All selected lines must have a valid order quantity';
    return;
  }

  isSubmitting.value = true;
  try {
    // TODO: Implement API call to submit PO
    // const response = await api.post('/api/purchase-orders', {
    //   status: 'SUBMITTED',
    //   header: form.header,
    //   lines: buildPoLines(),
    // });
    // 
    // await api.post(`/api/purchase-orders/${response.id}/submit`);
    console.log('PO submitted:', {
      status: 'SUBMITTED',
      header: form.header,
      lines: buildPoLines(),
    });
    // Redirect to PO detail or list
    // await router.push(`/purchase-orders/${response.id}`);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to submit PO';
  } finally {
    isSubmitting.value = false;
  }
};

const buildPoLines = () => {
  return allocationState.selectedLines.map(index => {
    const line = allocationState.lines[index];
    return {
      prNumber: line.prNumber,
      prLine: line.prLine,
      allocatedQty: line.orderQty,
      deliveryAddress: line.deliveryAddress,
      deliveryDate: line.deliveryDate,
      unitPrice: line.unitPrice,
    };
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};
</script>

<style scoped>
.error {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 8px;
  color: #dc3545;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
  background: var(--white);
  border-radius: var(--radius-card);
  padding: 24px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item.text-right {
  text-align: right;
}

.summary-label {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  font-weight: 500;
}

.summary-value {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
  letter-spacing: -1.6px;
}

.btn-secondary {
  background: #fdb702;
  color: var(--text);
}

.btn-secondary:hover {
  opacity: 0.85;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

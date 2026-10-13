<template>
  <div class="card-panel">
    <div class="card-panel-header">
      <p class="form-section-title" style="margin: 0;">Approved PR Lines</p>
      <button type="button" class="btn btn-outline" @click="refreshLines">
        Refresh Open Lines
      </button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style="width: 50px;">Select</th>
            <th style="width: 60px;">PR No</th>
            <th style="width: 47px;">PR Line</th>
            <th style="width: 85px;">Item Code</th>
            <th style="min-width: 115px;">Item Name</th>
            <th style="width: 58px;">UOM</th>
            <th style="width: 80px;">Requested QTY</th>
            <th style="width: 80px;">Allocated QTY</th>
            <th style="width: 80px;">Remaining QTY</th>
            <th style="width: 80px;">Order QTY</th>
            <th style="width: 100px;">Delivery Address</th>
            <th style="width: 100px;">Delivery Date</th>
            <th style="width: 80px;">Unit Price</th>
            <th style="width: 90px;">Line Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(line, index) in lines" :key="index" :class="{ selected: selectedLines.includes(index) }">
            <td style="text-align: center;">
              <input 
                type="checkbox" 
                :checked="selectedLines.includes(index)"
                @change="toggleLineSelection(index)"
              />
            </td>
            <td>{{ line.prNumber }}</td>
            <td>{{ line.prLine }}</td>
            <td>{{ line.itemCode }}</td>
            <td>{{ line.itemName }}</td>
            <td>{{ line.uom }}</td>
            <td class="text-right">{{ line.requestedQty }}</td>
            <td class="text-right">{{ line.allocatedQty }}</td>
            <td class="text-right">{{ line.remainingQty }}</td>
            <td>
              <input 
                v-model.number="line.orderQty" 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="0"
                @input="updateLineQty(index, $event)"
              />
            </td>
            <td>
              <input 
                v-model="line.deliveryAddress" 
                type="text"
                placeholder="Type..."
              />
            </td>
            <td>
              <input 
                v-model="line.deliveryDate" 
                type="date"
              />
            </td>
            <td>
              <input 
                v-model.number="line.unitPrice" 
                type="number" 
                min="0" 
                step="0.01"
                placeholder="0"
              />
            </td>
            <td class="text-right">{{ formatCurrency(line.lineAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  approvedLines: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['update:lines', 'refresh']);

// Initialize lines from props, adding editable fields
const lines = ref(props.approvedLines.map(line => ({
  ...line,
  orderQty: 0,
  deliveryAddress: '',
  deliveryDate: '',
  unitPrice: 0,
})));

const selectedLines = ref([]);

const toggleLineSelection = (index) => {
  const idx = selectedLines.value.indexOf(index);
  if (idx > -1) {
    selectedLines.value.splice(idx, 1);
  } else {
    selectedLines.value.push(index);
  }
  emitUpdate();
};

const updateLineQty = (index, event) => {
  const value = event.target.value;
  if (value !== '') {
    const line = lines.value[index];
    // Validate that order qty doesn't exceed remaining qty
    if (line.orderQty > line.remainingQty) {
      line.orderQty = line.remainingQty;
    }
  }
  emitUpdate();
};

const refreshLines = () => {
  emit('refresh');
};

const emitUpdate = () => {
  emit('update:lines', {
    selectedLines: selectedLines.value,
    lines: lines.value,
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
.table-wrapper {
  overflow-x: auto;
  border-radius: 10px;
  background: var(--white);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
}

thead tr {
  background: var(--table-header);
}

th, td {
  border-bottom: 1px solid var(--border);
  padding: 10px;
  font-size: 13px;
  text-align: left;
}

th {
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
}

tbody tr:hover {
  background: rgba(255, 64, 129, 0.02);
}

tbody tr.selected {
  background: rgba(255, 64, 129, 0.05);
}

input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

input[type="text"],
input[type="date"],
input[type="number"] {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 8px;
  font-size: 13px;
  font-family: inherit;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.1);
}

.text-right {
  text-align: right;
}
</style>

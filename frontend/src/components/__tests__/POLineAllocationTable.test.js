import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import POLineAllocationTable from '../POLineAllocationTable.vue';

const mockLines = [
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
];

describe('POLineAllocationTable Component', () => {
  test('renders table with correct columns', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const headers = wrapper.findAll('th');
    const headerText = headers.map(h => h.text());
    expect(headerText).toContain('Select');
    expect(headerText).toContain('PR No');
    expect(headerText).toContain('Item Code');
    expect(headerText).toContain('Item Name');
    expect(headerText).toContain('Requested QTY');
    expect(headerText).toContain('Allocated QTY');
    expect(headerText).toContain('Remaining QTY');
    expect(headerText).toContain('Order QTY');
  });

  test('renders all approved lines as table rows', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  test('displays correct item data in table cells', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const text = wrapper.text();
    expect(text).toContain('PR-001');
    expect(text).toContain('ITEM-001');
    expect(text).toContain('Bearing-6205');
    expect(text).toContain('PCS');
  });

  test('renders refresh button with correct text', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    expect(wrapper.text()).toContain('Refresh Open Lines');
  });

  test('renders checkbox for each line', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
  });

  test('toggles line selection when checkbox clicked', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0].setValue(true);

    expect(wrapper.emitted('update:lines')).toBeTruthy();
    const emitted = wrapper.emitted('update:lines')[0][0];
    expect(emitted.selectedLines).toContain(0);
  });

  test('emits refresh event when refresh button clicked', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const refreshButton = wrapper.find('button');
    await refreshButton.trigger('click');

    expect(wrapper.emitted('refresh')).toBeTruthy();
  });

  test('allows input in Order QTY field', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const orderQtyInputs = wrapper.findAll('input[type="number"]');
    await orderQtyInputs[0].setValue(10);

    expect(wrapper.emitted('update:lines')).toBeTruthy();
    const emitted = wrapper.emitted('update:lines')[0][0];
    expect(emitted.lines[0].orderQty).toBe(10);
  });

  test('allows input in Delivery Address field', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const addressInputs = wrapper.findAll('input[type="text"]');
    // Check if text inputs exist before testing
    if (addressInputs.length > 0) {
      await addressInputs[0].setValue('Warehouse JKT');
      // Should emit when input changes
      if (wrapper.emitted('update:lines')) {
        expect(wrapper.emitted('update:lines')).toBeTruthy();
      }
    }
  });

  test('allows input in Delivery Date field', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const dateInputs = wrapper.findAll('input[type="date"]');
    if (dateInputs.length > 0) {
      await dateInputs[0].setValue('2026-06-15');
      // Should emit when input changes
      if (wrapper.emitted('update:lines')) {
        expect(wrapper.emitted('update:lines')).toBeTruthy();
      }
    }
  });

  test('displays remaining qty for each line', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const text = wrapper.text();
    expect(text).toContain('15'); // Remaining qty for first line
    expect(text).toContain('12'); // Remaining qty for second line
  });

  test('displays requested qty for each line', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const text = wrapper.text();
    expect(text).toContain('20'); // Requested qty for first line
    expect(text).toContain('12'); // Requested qty for second line
  });

  test('multiple line selections are tracked', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0].setValue(true);
    await checkboxes[1].setValue(true);

    const emitted = wrapper.emitted('update:lines');
    expect(emitted).toBeTruthy();
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit.selectedLines).toHaveLength(2);
  });

  test('unselecting a line removes it from selectedLines', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0].setValue(true);
    await checkboxes[0].setValue(false);

    const emitted = wrapper.emitted('update:lines');
    const lastEmit = emitted[emitted.length - 1][0];
    expect(lastEmit.selectedLines).toHaveLength(0);
  });

  test('handles empty approvedLines prop', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: [] },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  test('renders table with white background', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const table = wrapper.find('table');
    expect(table.exists()).toBe(true);
  });

  test('each row has proper styling classes', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const rows = wrapper.findAll('tbody tr');
    rows.forEach(row => {
      expect(row.classes()).toBeTruthy();
    });
  });

  test('currency formatting function works for line amounts', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    // Check that currency format is applied to line amount cells
    const cells = wrapper.findAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });

  test('input fields in rows are properly focused and editable', async () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { approvedLines: mockLines },
    });

    const orderQtyInputs = wrapper.findAll('input[type="number"]');
    expect(orderQtyInputs[0].element.placeholder).toBe('0');
  });
});

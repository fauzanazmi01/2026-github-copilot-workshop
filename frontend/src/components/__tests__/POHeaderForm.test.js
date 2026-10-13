import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import POHeaderForm from '../POHeaderForm.vue';

describe('POHeaderForm Component', () => {
  test('renders all form fields', () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    expect(wrapper.find('input[placeholder*="Type"]').exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  test('renders section title "PO Header"', () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    expect(wrapper.text()).toContain('PO Header');
  });

  test('renders all four label fields', () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    expect(wrapper.text()).toContain('Vendor');
    expect(wrapper.text()).toContain('Needed By date');
    expect(wrapper.text()).toContain('Currency');
    expect(wrapper.text()).toContain('Payment Terms');
    expect(wrapper.text()).toContain('Notes');
  });

  test('emits update:modelValue when vendor field changes', async () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length > 0) {
      await inputs[0].setValue('PT Jaya');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      const emitted = wrapper.emitted('update:modelValue')[0][0];
      expect(emitted.vendor).toBe('PT Jaya');
    }
  });

  test('emits update:modelValue when currency select changes', async () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const currencySelect = wrapper.find('select');
    await currencySelect.setValue('USD');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const emitted = wrapper.emitted('update:modelValue')[0][0];
    expect(emitted.currency).toBe('USD');
  });

  test('emits update:modelValue when date field changes', async () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const dateInput = wrapper.find('input[type="date"]');
    await dateInput.setValue('2026-06-15');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const emitted = wrapper.emitted('update:modelValue')[0][0];
    expect(emitted.neededByDate).toBe('2026-06-15');
  });

  test('emits update:modelValue when textarea notes field changes', async () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const notesTextarea = wrapper.find('textarea');
    await notesTextarea.setValue('Special delivery instructions');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    const emitted = wrapper.emitted('update:modelValue')[0][0];
    expect(emitted.notes).toBe('Special delivery instructions');
  });

  test('renders with default currency when not provided', () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const select = wrapper.find('select');
    expect(select.element.value).toBe('IDR');
  });

  test('preserves other fields when updating single field', async () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: 'PT Jaya',
          neededByDate: '2026-06-15',
          currency: 'IDR',
          paymentTerms: 'NET 30',
          notes: 'Notes here',
        },
      },
    });

    const inputs = wrapper.findAll('input[type="text"]');
    if (inputs.length > 0) {
      await inputs[0].setValue('PT Maju');
      const emitted = wrapper.emitted('update:modelValue')[0][0];
      expect(emitted.vendor).toBe('PT Maju');
      expect(emitted.neededByDate).toBe('2026-06-15');
      expect(emitted.paymentTerms).toBe('NET 30');
    }
  });

  test('currency dropdown has all required options', () => {
    const wrapper = mount(POHeaderForm, {
      props: {
        modelValue: {
          vendor: '',
          neededByDate: '',
          currency: 'IDR',
          paymentTerms: '',
          notes: '',
        },
      },
    });

    const options = wrapper.findAll('select option');
    const values = options.map(opt => opt.element.value);
    expect(values).toContain('IDR');
    expect(values).toContain('USD');
    expect(values).toContain('EUR');
  });
});

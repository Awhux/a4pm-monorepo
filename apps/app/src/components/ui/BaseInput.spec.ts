import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseInput from './BaseInput.vue'

describe('BaseInput', () => {
  it('renders label', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: ''
      }
    })
    expect(wrapper.find('label').text()).toBe('Test Label')
  })

  it('renders input value', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: 'initial value'
      }
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('initial value')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: ''
      }
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('displays error message', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        label: 'Test Label',
        modelValue: '',
        error: 'Invalid input'
      }
    })
    expect(wrapper.text()).toContain('Invalid input')
  })
})


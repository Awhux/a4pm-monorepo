import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies type attribute', () => {
    const wrapper = mount(BaseButton, {
      props: {
        type: 'submit'
      }
    })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('is a button by default', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.attributes('type')).toBe('button')
  })
})


import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import RecipeCard from './RecipeCard.vue'

describe('RecipeCard', () => {
  const defaultProps = {
    title: 'Test Recipe',
    category: 'Dessert',
    prepTime: 30,
    servings: 4,
    author: 'Chef Test'
  }

  it('renders recipe details', () => {
    const wrapper = mount(RecipeCard, {
      props: defaultProps
    })
    expect(wrapper.text()).toContain('Test Recipe')
    expect(wrapper.text()).toContain('Dessert')
    expect(wrapper.text()).toContain('30 min')
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('Chef Test')
  })

  it('emits click event', async () => {
    const wrapper = mount(RecipeCard, {
      props: defaultProps
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders partial details if some props are missing', () => {
    const wrapper = mount(RecipeCard, {
      props: {
        title: 'Minimal Recipe'
      }
    })
    expect(wrapper.text()).toContain('Minimal Recipe')
    expect(wrapper.text()).not.toContain('Categoria:')
    expect(wrapper.text()).not.toContain('Tempo:')
  })
})


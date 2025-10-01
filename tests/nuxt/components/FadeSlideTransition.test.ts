import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FadeSlideTransition from '~/components/ui/FadeSlideTransition.vue'
import { h } from 'vue'

describe('FadeSlideTransition', () => {
  it('should render with default props', () => {
    const wrapper = mount(FadeSlideTransition, {
      slots: {
        default: 'Test Content'
      }
    })

    expect(wrapper.text()).toContain('Test Content')
  })

  it('should use default transition name "fade-slide"', () => {
    const wrapper = mount(FadeSlideTransition, {
      slots: {
        default: 'Test Content'
      }
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.props('name')).toBe('fade-slide')
  })

  it('should use default mode "out-in"', () => {
    const wrapper = mount(FadeSlideTransition, {
      slots: {
        default: 'Test Content'
      }
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.props('mode')).toBe('out-in')
  })

  it('should accept custom transition name', () => {
    const wrapper = mount(FadeSlideTransition, {
      props: {
        name: 'custom-transition'
      },
      slots: {
        default: 'Test Content'
      }
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.props('name')).toBe('custom-transition')
  })

  it('should accept custom mode', () => {
    const wrapper = mount(FadeSlideTransition, {
      props: {
        mode: 'in-out'
      },
      slots: {
        default: 'Test Content'
      }
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.props('mode')).toBe('in-out')
  })

  it('should render slot content', () => {
    const wrapper = mount(FadeSlideTransition, {
      slots: {
        default: h('div', { class: 'test-class' }, 'Slot Content')
      }
    })

    expect(wrapper.find('.test-class').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot Content')
  })

  it('should pass through additional attributes', () => {
    const wrapper = mount(FadeSlideTransition, {
      attrs: {
        'data-testid': 'transition-wrapper'
      },
      slots: {
        default: 'Test Content'
      }
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.attributes('data-testid')).toBe('transition-wrapper')
  })
})
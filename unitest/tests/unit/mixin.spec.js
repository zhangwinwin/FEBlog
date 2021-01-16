import { mount } from '@vue/test-utils'
import { titleMixin } from '@/mixin/changeTitle.js'

describe('titleMixin', () => {
  test('import titleMixin to change the title', () => {
    const component = {
      render() {},
      title: 'hello',
      mixins: [titleMixin]
    }
    mount(component)
    expect(document.title).toBe('hello mixin')
  })
})
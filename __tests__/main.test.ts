jest.mock('../src/lib', () => ({
  __esModule: true,
  default: jest.fn()
}))

import run from '../src/lib'

describe('main', () => {
  it('should invoke run() on import', async () => {
    await import('../src/main')
    expect(run).toHaveBeenCalledTimes(1)
  })
})

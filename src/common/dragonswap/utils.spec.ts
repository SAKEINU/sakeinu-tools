import {
  calculateAmountInForExactOut,
  calculateAmountOutForExactIn,
} from './utils'

describe('utils', () => {
  it('calculateAmountOutForExactIn', () => {
    expect(calculateAmountOutForExactIn(1000000n, 1000000n, 1000n)).toBe(996n)
  })

  it('calculateAmountInForExactOut', () => {
    expect(calculateAmountInForExactOut(1000000n, 1000000n, 1000n)).toBe(1005n)
  })
})

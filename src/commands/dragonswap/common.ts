import { ethers } from 'ethers'
import { config } from '../../common/config/config'
import { wallet } from '../../common/wallet'

interface Balances {
  userSEI: string
  userSAKEINU: string
  pairWSEI: string
  pairSAKEINU: string
}

export async function balances(rpcUrl: string, address?: string): Promise<Balances> {
  const sakeinu = config.sakeInu
  const wsei = config.dsConfig.wsei
  const pair = config.dsConfig.pair
  const owner = address ? address : wallet.address
  // Prepare JSON-RPC batch request
  const batch = [
    {
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [owner, 'latest'],
    },
    {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: sakeinu,
          data: encodeBalanceOf(owner),
        },
        'latest',
      ],
      id: 2,
    },
    {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: wsei,
          data: encodeBalanceOf(pair),
        },
        'latest',
      ],
      id: 3,
    },
    {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: sakeinu,
          data: encodeBalanceOf(pair),
        },
        'latest',
      ],
      id: 4,
    },
  ]
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
    })

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
    }

    const results = await response.json()
    return {
      userSEI: results[0].result,
      userSAKEINU: results[1].result,
      pairWSEI: results[2].result,
      pairSAKEINU: results[3].result,
    }
  } catch (error) {
    console.error(error)
  }

  return undefined
}

const abiCoder = new ethers.AbiCoder()
function encodeBalanceOf(address: string): string {
  return '0x70a08231' + abiCoder.encode(['address'], [address]).substring(2)
}

export function calculateAmountOut(
  reserveA: bigint,
  reserveB: bigint,
  amountIn: bigint,
): bigint {
  // uniswap xy=k
  const amountInWithFee = amountIn * 997n // 0.3% fee
  const numerator = amountInWithFee * reserveB
  const denominator = reserveA * 1000n + amountInWithFee
  return numerator / denominator
}

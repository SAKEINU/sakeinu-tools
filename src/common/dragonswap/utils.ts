import { ethers } from 'ethers'

export interface Balance {
  userSEI: string
  userSAKEINU: string
  pairWSEI: string
  pairSAKEINU: string
}

export async function balances(
  rpcUrl: string,
  sakeinu: string,
  wsei: string,
  pair: string,
  owner: string,
): Promise<Balance> {
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

export function calculateAmountOutForExactIn(
  reserveIn: bigint,
  reserveOut: bigint,
  amountIn: bigint,
): bigint {
  const amountEffective = (amountIn * 997n) / 1000n // amountIn * 0.997
  const numerator = amountEffective * reserveOut
  const denominator = reserveIn + amountEffective
  return numerator / denominator
}

export function calculateAmountInForExactOut(
  reserveIn: bigint,
  reserveOut: bigint,
  amountOut: bigint,
): bigint {
  const numerator = reserveIn * amountOut * 1000n
  const denominator = (reserveOut - amountOut) * 997n
  return numerator / denominator + BigInt(1)
}

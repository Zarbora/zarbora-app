import { parseUnits, formatUnits } from "viem";

// Mock contract addresses
const MOCK_ADDRESSES = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC address
};

// Token decimals
const DECIMALS = {
  ETH: 18,
  USDC: 6,
};

// Mock contract ABIs (simplified for demonstration)
const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
  "function transfer(address,uint256) returns (bool)",
];

// Currency type
export type Currency = "ETH" | "USDC";

// Mock delay to simulate blockchain interactions
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 1000));

// Mock contract state
let mockState = {
  balances: new Map<string, bigint>(),
  allowances: new Map<string, bigint>(),
  taxRates: new Map<string, number>(),
  resourceValues: new Map<string, { amount: bigint; currency: Currency }>(),
};

export interface ContractValue {
  raw: bigint;
  formatted: string;
  symbol: Currency;
}

// Utility function to format contract values
export function formatContractValue(
  value: bigint,
  currency: Currency
): ContractValue {
  return {
    raw: value,
    formatted: formatUnits(value, DECIMALS[currency]),
    symbol: currency,
  };
}

// Mock function to get resource value from contract
export async function getResourceValue(
  resourceId: string
): Promise<ContractValue> {
  await mockDelay();
  const stored = mockState.resourceValues.get(resourceId);
  if (stored) {
    return formatContractValue(stored.amount, stored.currency);
  }
  // Default: 100 USDC
  return formatContractValue(parseUnits("100", DECIMALS.USDC), "USDC");
}

// Mock function to get daily tax rate from contract
export async function getDailyTaxRate(
  resourceId: string
): Promise<ContractValue> {
  await mockDelay();
  const stored = mockState.resourceValues.get(resourceId);
  const currency = stored?.currency || "USDC";
  const rate = mockState.taxRates.get(resourceId) || 0.1; // 10% annual rate
  const dailyRate = rate / 365;
  const value = parseUnits(
    dailyRate.toFixed(DECIMALS[currency]),
    DECIMALS[currency]
  );
  return formatContractValue(value, currency);
}

// Mock function to update resource value
export async function updateResourceValue(
  resourceId: string,
  newValue: string,
  currency: Currency
): Promise<boolean> {
  await mockDelay();
  try {
    const valueInSmallestUnit = parseUnits(newValue, DECIMALS[currency]);
    mockState.resourceValues.set(resourceId, {
      amount: valueInSmallestUnit,
      currency,
    });
    return true;
  } catch (error) {
    console.error("Error updating resource value:", error);
    return false;
  }
}

// Mock function to get total tax collected
export async function getTotalTaxCollected(
  societyId: string
): Promise<ContractValue> {
  await mockDelay();
  // Mock calculation: sum of all resource values * daily tax rate
  let totalETH = BigInt(0);
  let totalUSDC = BigInt(0);

  mockState.resourceValues.forEach((value) => {
    const dailyTax = (value.amount * BigInt(10)) / BigInt(365 * 1000); // 10% annual rate
    if (value.currency === "ETH") {
      totalETH += dailyTax;
    } else {
      totalUSDC += dailyTax;
    }
  });

  // Default to USDC if no values found
  if (totalUSDC > BigInt(0)) {
    return formatContractValue(totalUSDC, "USDC");
  }
  return formatContractValue(totalETH, "ETH");
}

// Mock function to get user's tax payments
export async function getUserTaxPayments(
  address: string
): Promise<ContractValue> {
  await mockDelay();
  // Mock calculation based on owned resources
  const dailyTax = parseUnits("5", DECIMALS.USDC); // Default 5 USDC per day
  return formatContractValue(dailyTax, "USDC");
}

// Mock function to get pool balance
export async function getPoolBalance(poolId: string): Promise<ContractValue> {
  await mockDelay();
  const balance = parseUnits("1000", DECIMALS.USDC); // Default 1000 USDC
  return formatContractValue(balance, "USDC");
}

// Mock function to get pool target
export async function getPoolTarget(poolId: string): Promise<ContractValue> {
  await mockDelay();
  const target = parseUnits("10000", DECIMALS.USDC); // Default 10000 USDC
  return formatContractValue(target, "USDC");
}

// Reset mock state (useful for testing)
export function resetMockState() {
  mockState = {
    balances: new Map(),
    allowances: new Map(),
    taxRates: new Map(),
    resourceValues: new Map(),
  };
}

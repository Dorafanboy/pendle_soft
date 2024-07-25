import { PrivateKeyAccount } from 'viem';

export interface IBridgeRange {
    readonly minRange: number;
    readonly maxRange: number;
}

export interface IFixedRange extends IBridgeRange {}

export interface IDelayRange extends IBridgeRange {}

export interface IFunction {
    readonly func: (account: PrivateKeyAccount) => Promise<boolean>;
    readonly isUse: boolean;
}

export interface IMultiplyResult {
    readonly ytOut: bigint;
    readonly guessMin: bigint;
    readonly guessMax: bigint;
    readonly guessOffchain: bigint;
}

interface ExtraFee {
    feeAmount: string;
    chargeFeeBy: string;
    isInBps: boolean;
    feeReceiver: string;
}

interface PoolExtra {
    blockNumber: number;
}

interface Route {
    pool: string;
    tokenIn: string;
    tokenOut: string;
    limitReturnAmount: string;
    swapAmount: string;
    amountOut: string;
    exchange: string;
    poolLength: number;
    poolType: string;
    poolExtra: PoolExtra;
    extra: null;
}

interface RouteSummary {
    tokenIn: string;
    amountIn: string;
    amountInUsd: string;
    tokenOutMarketPriceAvailable: boolean;
    tokenInMarketPriceAvailable: boolean;
    tokenOut: string;
    amountOut: string;
    amountOutUsd: string;
    gas: string;
    gasPrice: string;
    gasUsd: string;
    extraFee: ExtraFee;
    route: Route[];
}

interface Data {
    routeSummary: RouteSummary;
    routerAddress: string;
}

export interface ITransaction {
    code: number;
    message: string;
    data: Data;
    requestId: string;
}

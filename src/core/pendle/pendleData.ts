import { IBridgeRange, IMultiplyResult } from '../../data/utils/interfaces';

export const pendleModuleName = 'Pendle deposit ETH to get YT pzETH';

export const pendleContractAddress = '0x888888888889758F76e7103c6CbF23ABbF58F946';
export const pendleMarketContractAddress = '0xd3bb297264bd6115aE163db4153038a79D78acBA';

export const ytOut: IBridgeRange = { minRange: 44.9, maxRange: 46 }; //44.9 22.9 50 45.8
export const guessMin: IBridgeRange = { minRange: 22.9, maxRange: 24 };
export const guessMax: IBridgeRange = { minRange: 50, maxRange: 51 };
export const guessOffchain: IBridgeRange = { minRange: 45.8, maxRange: 47 };
export const maxIteration = 30;
export const eps = 1000000000000000;

export const tokenMintSy = '0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811';
export const pendleSwap = '0x1e8b6Ac39f8A33f46a6Eb2D1aCD1047B99180AD1';
export const swapType = 1;
export const extRouter = '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5';

export const dataRecepient = '0x888888888889758f76e7103c6cbf23abbf58f946';

function getMultiplyNumber(min: number, max: number): number {
    const num = Math.random() * (max - min) + min;
    const str = num.toFixed(18);
    const lastDigit = Math.round(Number(str[str.length - 1]));
    const newStr = str.slice(0, str.length - 1) + lastDigit;
    return Number(newStr);
}

export function getMultiplyDataResult(depositValue: number): IMultiplyResult {
    return {
        ytOut: BigInt(Math.round(depositValue * getMultiplyNumber(ytOut.minRange, ytOut.maxRange))),
        guessMin: BigInt(Math.round(depositValue * getMultiplyNumber(guessMin.minRange, guessMin.maxRange))),
        guessMax: BigInt(Math.round(depositValue * getMultiplyNumber(guessMax.minRange, guessMax.maxRange))),
        guessOffchain: BigInt(
            Math.round(depositValue * getMultiplyNumber(guessOffchain.minRange, guessOffchain.maxRange)),
        ),
    };
}

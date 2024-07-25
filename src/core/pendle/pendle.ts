import {
    createPublicClient,
    createWalletClient,
    encodeFunctionData,
    formatUnits,
    http,
    PrivateKeyAccount,
    SimulateContractReturnType,
    zeroAddress,
} from 'viem';
import { printError, printInfo, printSuccess } from '../../data/logger/logPrinter';
import { Config, PendleConfig } from '../../config';
import { getValue } from '../../data/utils/utils';
import { delay } from '../../data/helpers/delayer';
import { mainnet } from 'viem/chains';
import {
    eps,
    extRouter,
    getMultiplyDataResult,
    maxIteration,
    pendleContractAddress,
    pendleMarketContractAddress,
    pendleModuleName,
    pendleSwap,
    swapType,
    tokenMintSy,
} from './pendleData';
import { pendleABI } from '../../abis/pendle';
import * as console from 'node:console';
import { getRoutesData, getTxData } from './pendleRequester';
import { checkGwei } from '../../data/helpers/gweiChecker';

export async function pendleDepositETH(account: PrivateKeyAccount) {
    printInfo(`Выполняю модуль ${pendleModuleName}`);

    const client = createPublicClient({
        chain: mainnet,
        transport: Config.rpc == null ? http() : http(Config.rpc),
    });

    const walletClient = createWalletClient({
        chain: mainnet,
        transport: Config.rpc == null ? http() : http(Config.rpc),
    });

    let currentTry: number = 0,
        value = BigInt(0);

    while (currentTry <= Config.retryCount) {
        if (currentTry == Config.retryCount) {
            printError(
                `Не нашел баланс для ${pendleModuleName}. Превышено количество попыток - [${currentTry}/${Config.retryCount}]\n`,
            );
            return false;
        }

        value = await getValue(
            client,
            account.address,
            PendleConfig.ethBridgeAmount.range,
            PendleConfig.ethBridgeAmount.fixed,
            true,
        );

        printInfo(`Пытаюсь произвести deposit ${formatUnits(value, 18)} ETH`);

        currentTry++;

        if (value != null && value != BigInt(-1)) {
            currentTry = Config.retryCount + 1;
        } else {
            await delay(Config.delayBetweenAction.minRange, Config.delayBetweenAction.maxRange, false);
        }
    }

    await checkGwei();

    printInfo(`Буду производить deposit ${formatUnits(value, 18)} ETH`);

    const result = getMultiplyDataResult(Number(value));

    const routesData = await getRoutesData(value.toString());
    const txData = await getTxData(routesData, account.address);

    const data = encodeFunctionData({
        abi: pendleABI,
        functionName: 'swapExactTokenForYt',
        args: [
            account.address,
            pendleMarketContractAddress,
            result.ytOut,
            [result.guessMin, result.guessMax, result.guessOffchain, maxIteration, eps],
            [zeroAddress, Number(value), tokenMintSy, pendleSwap, [swapType, extRouter, txData, []]],
            [zeroAddress, 0, [], [], '0x'],
        ],
    });

    const preparedTransaction = await walletClient.prepareTransactionRequest({
        account,
        to: pendleContractAddress,
        data: data,
        value: value,
    });

    const signature = await walletClient.signTransaction(preparedTransaction).catch((e) => {
        printError(`Произошла ошибка во время выполнения модуля ${pendleModuleName} ${e}`);
        return undefined;
    });

    // if (signature !== undefined) {
    //     const hash = await walletClient.sendRawTransaction({ serializedTransaction: signature }).catch((e) => {
    //         printError(`Произошла ошибка во время выполнения модуля ${pendleModuleName} ${e}`);
    //         return false;
    //     });
    //
    //     if (hash == false) {
    //         return false;
    //     }
    //
    //     const url = `${mainnet.blockExplorers?.default.url + '/tx/' + hash}`;
    //
    //     const transaction = await client
    //         .waitForTransactionReceipt({ hash: <`0x${string}`>hash })
    //         .then((result) => printSuccess(`Транзакция успешно отправлена. Хэш транзакции: ${url}\n`))
    //         .catch((e) => {
    //             printError(`Произошла ошибка во время выполнения модуля ${pendleModuleName} - ${e}`);
    //             return { request: undefined };
    //         });
    //
    //     return true;
    // }

    return false;
}

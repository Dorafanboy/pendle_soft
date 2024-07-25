import axios from 'axios';
import { ITransaction } from '../../data/utils/interfaces';
import { printError, printSuccess } from '../../data/logger/logPrinter';
import { dataRecepient } from './pendleData';

export async function getRoutesData(amountIn: string): Promise<ITransaction> {
    const response = await axios
        .get('https://proxy.scalar.com/', {
            params: {
                scalar_url: `https://aggregator-api.kyberswap.com/ethereum/api/v1/routes?tokenIn=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&tokenOut=0x8c9532a60e0e7c6bbd2b2c1303f63ace1c3e9811&amountIn=${amountIn}&saveGas=false&gasInclude=true`,
            },
            headers: {
                accept: 'application/json, text/plain, */*',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                origin: 'https://docs.kyberswap.com',
                priority: 'u=1, i',
                referer:
                    'https://docs.kyberswap.com/kyberswap-solutions/kyberswap-aggregator/aggregator-api-specification/evm-swaps',
                'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            },
        })
        .then(async (res) => {
            printSuccess(`Успешно получил конфиг routes`);
            return res;
        })
        .catch((err) => {
            printError(`Произошла ошибка во время получения routes - ${err}`);
            return null;
        });

    return {
        ...response!.data,
    };
}

export async function getTxData(data: ITransaction, sender: string): Promise<string> {
    const response = await axios
        .post(
            'https://proxy.scalar.com/',
            {
                routeSummary: data.data.routeSummary,
                sender: sender.toLowerCase(),
                recipient: dataRecepient,
                slippageTolerance: 200,
                deadline: 2147483647,
            },
            {
                params: {
                    scalar_url: 'https://aggregator-api.kyberswap.com/ethereum/api/v1/route/build',
                },
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/json',
                    origin: 'https://docs.kyberswap.com',
                    priority: 'u=1, i',
                    referer:
                        'https://docs.kyberswap.com/kyberswap-solutions/kyberswap-aggregator/aggregator-api-specification/evm-swaps',
                    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'cross-site',
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                },
            },
        )
        .then(async (res) => {
            printSuccess(`Успешно получил данные транзакции`);
            return res;
        })
        .catch((err) => {
            printError(`Произошла ошибка во время получения данных транзакции - ${err}`);
            return null;
        });

    return response!.data.data.data;
}

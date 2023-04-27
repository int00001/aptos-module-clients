import { AptosClient, BCS, TxnBuilderTypes } from 'aptos';

import { TESTNET_NODE_URL } from 'config';
import { getSequence, loadAccount } from 'utils';

const {
  ChainId,
  EntryFunction,
  AccountAddress,
  RawTransaction,
  TransactionPayloadEntryFunction,
} = TxnBuilderTypes;

const main = async () => {
  const client = new AptosClient(TESTNET_NODE_URL);
  const account = loadAccount();

  const entryFunctionPayload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      `${account.address()}::todolist`,
      'complete_task',
      [],
      [BCS.bcsSerializeUint64(1)]
    )
  );

  const { sequenceNumber, chainId } = await getSequence(client, account);

  const rawTx = new RawTransaction(
    AccountAddress.fromHex(account.address()),
    BigInt(sequenceNumber),
    entryFunctionPayload,
    BigInt(2000),
    BigInt(100),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new ChainId(chainId)
  );

  const bcsTx = AptosClient.generateBCSTransaction(account, rawTx);
  const res = await client.submitSignedBCSTransaction(bcsTx);
  await client.waitForTransaction(res.hash);
};

main();

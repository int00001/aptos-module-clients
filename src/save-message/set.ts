import { AptosClient, BCS, TxnBuilderTypes } from 'aptos';

import { TESTNET_NODE_URL } from 'config';
import { loadAccount } from 'utils';

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

  // tx payload
  const entryFunctionPayload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      `${account.address()}::message`,
      'set_message',
      [],
      // note: signer is first param, but does not get passed in as argument to payload
      [BCS.bcsSerializeStr('test555')]
    )
  );

  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  // tx
  const rawTx = new RawTransaction(
    AccountAddress.fromHex(account.address()),
    BigInt(sequenceNumber),
    entryFunctionPayload,
    BigInt(2000),
    BigInt(100),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new ChainId(chainId)
  );

  // send
  const bcsTx = AptosClient.generateBCSTransaction(account, rawTx);
  const res = await client.submitSignedBCSTransaction(bcsTx);
  await client.waitForTransaction(res.hash);
};

main();

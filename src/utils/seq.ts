import { AptosAccount, AptosClient } from 'aptos';

export const getSequence = async (
  client: AptosClient,
  account: AptosAccount
) => {
  const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
    client.getAccount(account.address()),
    client.getChainId(),
  ]);

  return { sequenceNumber, chainId };
};

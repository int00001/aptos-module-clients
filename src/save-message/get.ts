import { AptosClient } from 'aptos';

import { TESTNET_NODE_URL } from 'config';
import { loadAccount } from 'utils';

const main = async () => {
  const client = new AptosClient(TESTNET_NODE_URL);
  const account = loadAccount();

  // get all resources
  const resources = await client.getAccountResources(account.address());
  console.log(resources);

  // get specific resource by struct type string
  const resourceType = `${account.address()}::message::MessageHolder`;
  const messageResource = await client.getAccountResource(
    account.address(),
    resourceType
  );
  console.log(messageResource);
  console.log((messageResource.data as any).message);
};

main();

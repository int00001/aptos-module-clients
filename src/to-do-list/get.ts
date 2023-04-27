import { AptosClient } from 'aptos';

import { TESTNET_NODE_URL } from 'config';
import { loadAccount } from 'utils';

const main = async () => {
  const client = new AptosClient(TESTNET_NODE_URL);
  const account = loadAccount();

  // get specific resource by struct type string
  const resourceType = `${account.address()}::todolist::TodoList`;
  const todoListResource = await client.getAccountResource(
    account.address(),
    resourceType
  );
  console.log(todoListResource);

  // address that points to table
  const tableHandle = (todoListResource as any).data.tasks.handle;
  // task table item
  const tableItem = {
    key_type: 'u64',
    value_type: `${account.address()}::todolist::Task`,
    key: '1',
  };
  // get task
  const task = await client.getTableItem(tableHandle, tableItem);
  console.log(task);
};

main();

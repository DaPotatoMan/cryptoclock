import { getActiveAccount, getContractInstance } from '../wallet/sdk';

let cachedTransactions = {} as TransactionGroup;

export function estimateFee(amount: number) {
   const clampNumber = (value: number, min: number, max: number) => Math.max(Math.min(value, Math.max(min, max)), Math.min(min, max));
   const fee = Math.round((10 / 100) * amount);

   return clampNumber(fee, 0.0001, 0.01);
}

export async function getTransactions() {
   const account = await getActiveAccount();
   const contract = await getContractInstance();
   const storage: RawTransactions = (await contract.storage()) || [];

   const transactions: TransactionGroup = {
      all: [],
      user: [],
      pending: []
   };

   // Sort storage
   storage.sort((a, b) => {
      if (a === b) return 0;
      return Date.parse(a.datetime) > Date.parse(b.datetime) ? -1 : 1;
   });

   // Filter to groups
   storage.forEach((data) => {
      const {
         completed,
         recipient: recipientAddress,
         scheduler_address: schedulerAddress
      } = data;
      const [amount] = data.amount.c;
      const [fee] = data.fee.c;
      const datetime = new Date(data.datetime);
      const isOwn = schedulerAddress === account?.address;

      const transaction = {
         schedulerAddress,
         recipientAddress,
         isOwn,
         completed,
         datetime,
         amount: amount / 1e6,
         fee: fee / 1e6
      };

      if (!completed) transactions.pending.push(transaction);
      if (isOwn) transactions.user.push(transaction);
      transactions.all.push(transaction);
   });

   // Store transactions
   cachedTransactions = transactions;

   // Fire listener event
   events.emit('transactions-updated');

   return transactions;
}

export function getCachedTransactions() {
   return cachedTransactions;
}

export async function scheduleTransaction(data: TransactionData) {
   const { amount, fee, datetime } = data;
   const contract = await getContractInstance();

   const operation = await contract.methods
      .schedule_transaction(
         amount * 1e6,
         datetime.toISOString(),
         fee * 1e6,
         data.recipientAddress
      )
      .send({
         amount: amount + fee
      });

   const approved = await operation.getCurrentConfirmation();
   const sucessful = operation.confirmation();
   return { approved, sucessful };
}

export async function runTransactions() {
   try {
      const contract = await getContractInstance();
      const operation = await contract.methods.run_transactions(null).send();
      return await operation.confirmation();
   } catch (error) {
      console.error(error);
      return false;
   }
}

export async function cancelTransaction(data: Transaction) {
   const contract = await getContractInstance();
   const operation = await contract.methods
      .cancel_transaction(
         data.amount * 1e6,
         data.datetime.toISOString(),
         data.fee * 1e6,
         data.recipientAddress
      )
      .send();
   return operation.confirmation();
}

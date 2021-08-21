import { getActiveAccount, getContractInstance } from '../wallet/sdk';

export function estimateFee(amount: number) {
   const clampNumber = (value: number, min: number, max: number) => Math.max(Math.min(value, Math.max(min, max)), Math.min(min, max));
   const fee = Math.round((10 / 100) * amount);

   return clampNumber(fee, 0.0001, 0.01);
}

export async function getTransactions() {
   const account = await getActiveAccount();
   const contract = await getContractInstance();
   const storage: RawTransactions = (await contract.storage()) || [];

   const all = [] as Transactions;
   const user = [] as Transactions;

   storage.forEach((data) => {
      const {
         completed,
         recipient: recipientAddress,
         scheduler_address: schedulerAddress
      } = data;
      const [amount] = data.amount.c;
      const [fee] = data.fee.c;
      const datetime = new Date(data.datetime);

      const transaction = {
         schedulerAddress,
         recipientAddress,
         completed,
         datetime,
         amount: amount / 1e6,
         fee: fee / 1e6
      };

      if (data.scheduler_address === account?.address) user.push(transaction);
      all.push(transaction);
   });

   // Sort
   const sorter = (a: Transaction, b: Transaction) => {
      if (a === b) return 0;
      return a.datetime > b.datetime ? -1 : 1;
   };

   all.sort(sorter);
   user.sort(sorter);

   return { all, user };
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

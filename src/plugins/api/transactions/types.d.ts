// Server Data Types
interface RawTransactionCurrency {
   s: number;
   e: number;
   c: number[];
}

interface RawTransaction {
   amount: RawTransactionCurrency;
   completed: boolean;
   datetime: string;
   fee: RawTransactionCurrency;
   recipient: string;
   scheduler_address: string;
}

type RawTransactions = RawTransaction[];

// Client-Side Data Types
interface TransactionData {
   amount: number;
   fee: number;
   datetime: Date;
   recipientAddress: string;
}

interface Transaction extends TransactionData {
   completed: boolean;
   schedulerAddress: string;
}

type Transactions = Transaction[];

interface TransactionGroup {
   all: Transactions;
   user: Transactions;
   pending: Transactions;
}

import '@cryptoclock/utils';
import store from '~/plugins/store';

const { TezosToolkit, BeaconWallet } = window.walletUtils;

const rpcClientType = import.meta.env.VITE_APP_RPC_CLIENT_TYPE as string;
const rpcClientDomain = import.meta.env.VITE_APP_RPC_CLIENT_DOMAIN as string;
const contractAddress = import.meta.env.VITE_APP_CONTRACT_ADDRESS as string;

const network: any = {
   type: rpcClientType
};

const tezos = new TezosToolkit(rpcClientDomain);
const wallet = new BeaconWallet({
   name: 'Crypto Clock',
   preferredNetwork: network.type
});
tezos.setWalletProvider(wallet);

export function connectWallet() {
   return wallet.client.requestPermissions({ network }).then(() => {
      tezos.setWalletProvider(wallet);
      return wallet;
   });
}

export async function disconnectWallet() {
   await wallet.disconnect();
   store.value.isAuthorized = false;
}

export async function getContractInstance() {
   const address = await wallet.getPKH();
   if (!address) await wallet.requestPermissions({ network });

   return tezos.wallet.at(contractAddress);
}

export function getActiveAccount() {
   return wallet.client.getActiveAccount();
}

export async function isWalletConnected() {
   const activeAccount = await getActiveAccount();
   return !!activeAccount ?? false;
}

export function validateAddress(address: string): boolean {
   if (address?.length === 36) {
      return window.walletUtils.validateAddress(address) === 3;
   }

   return false;
}

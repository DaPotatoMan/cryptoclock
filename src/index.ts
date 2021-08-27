import { TezosToolkit } from '@taquito/taquito';
import { validateAddress } from '@taquito/utils';
import { BeaconWallet } from './beacon';

// Assign to window
Object.defineProperty(window, 'walletUtils', {
   value: {
      TezosToolkit,
      BeaconWallet,
      validateAddress
   }
});

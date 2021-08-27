import { TezosToolkit } from '@taquito/taquito';
import { validateAddress } from '@taquito/utils';
import { BeaconWallet } from './beacon';

// Emit declarations
declare global {
   interface Window {
      beacon: typeof import('@airgap/beacon-sdk');
      walletUtils: {
         TezosToolkit: typeof import('@taquito/taquito').TezosToolkit;
         BeaconWallet: typeof import('./beacon').BeaconWallet;
         validateAddress: typeof import('@taquito/utils').validateAddress;
      };
   }
}

export { TezosToolkit, BeaconWallet, validateAddress };

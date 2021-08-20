interface Window {
   walletUtils: {
      TezosToolkit: typeof import('@taquito/taquito').TezosToolkit,
      BeaconWallet: typeof import('@taquito/beacon-wallet').BeaconWallet,
      validateAddress: typeof import('@taquito/utils').validateAddress,
   };
   axios: any;
}

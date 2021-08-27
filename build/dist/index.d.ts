/// <reference types="chrome" />
/// <reference types="filesystem" />
/// <reference types="filewriter" />
/// <reference types="libsodium-wrappers" />
/// <reference types="node" />

import { WalletDelegateParams, WalletOriginateParams, WalletProvider, WalletTransferParams } from '@taquito/taquito';

declare abstract class BeaconClient {
	/**
	 * The name of the client
	 */
	readonly name: string;
	/**
	 * The URL of the dApp Icon. This can be used to display the icon of the dApp on in the wallet
	 */
	readonly iconUrl?: string;
	/**
	 * The URL of the dApp.
	 */
	readonly appUrl?: string;
	/** The beaconId is a public key that is used to identify one specific application (dapp or wallet).
	 * This is used inside a message to specify the sender, for example.
	 */
	protected _beaconId: ExposedPromise<string>;
	get beaconId(): Promise<string>;
	protected storage: Storage;
	protected readonly events: BeaconEventHandler;
	/**
	 * The local keypair that is used for the communication encryption
	 */
	protected _keyPair: ExposedPromise<sodium.KeyPair>;
	protected get keyPair(): Promise<sodium.KeyPair>;
	constructor(config: BeaconClientOptions);
	/**
	 * This resets the SDK. After using this method, this instance is no longer usable. You will have to instanciate a new client.
	 */
	destroy(): Promise<void>;
	/**
	 * This method initializes the SDK by setting some values in the storage and generating a keypair.
	 */
	private initSDK;
	/**
	 * Removes all beacon values from the storage.
	 */
	private removeBeaconEntriesFromStorage;
	/**
	 * This method tries to load the seed from storage, if it doesn't exist, a new one will be created and persisted.
	 */
	private loadOrCreateBeaconSecret;
}
declare abstract class BlockExplorer {
	readonly rpcUrls: {
		[key in NetworkType]: string;
	};
	constructor(rpcUrls: {
		[key in NetworkType]: string;
	});
	protected getLinkForNetwork(network: Network): Promise<string>;
	/**
	 * Return a blockexplorer link for an address
	 *
	 * @param address The address to be opened
	 * @param network The network that was used
	 */
	abstract getAddressLink(address: string, network: Network): Promise<string>;
	/**
	 * Return a blockexplorer link for a transaction hash
	 *
	 * @param transactionId The hash of the transaction
	 * @param network The network that was used
	 */
	abstract getTransactionLink(transactionId: string, network: Network): Promise<string>;
}
declare abstract class Client extends BeaconClient {
	protected readonly accountManager: AccountManager;
	protected handleResponse: (_event: BeaconRequestMessage, connectionInfo: ConnectionContext) => void;
	/**
	 * How many requests can be sent after another
	 */
	protected readonly rateLimit: number;
	/**
	 * The time window in seconds in which the "rateLimit" is checked
	 */
	protected readonly rateLimitWindowInSeconds: number;
	/**
	 * Stores the times when requests have been made to determine if the rate limit has been reached
	 */
	protected requestCounter: number[];
	protected readonly events: BeaconEventHandler;
	protected readonly matrixNodes: string[];
	protected _transport: ExposedPromise<Transport<any>>;
	protected get transport(): Promise<Transport<any>>;
	/**
	 * Returns the connection status of the Client
	 */
	get connectionStatus(): TransportStatus;
	/**
	 * Returns whether or not the transaport is ready
	 */
	get ready(): Promise<void>;
	constructor(config: ClientOptions);
	/**
	 * Return all locally known accounts
	 */
	getAccounts(): Promise<AccountInfo[]>;
	/**
	 * Return the account by ID
	 * @param accountIdentifier The ID of an account
	 */
	getAccount(accountIdentifier: string): Promise<AccountInfo | undefined>;
	/**
	 * Remove the account by ID
	 * @param accountIdentifier The ID of an account
	 */
	removeAccount(accountIdentifier: string): Promise<void>;
	/**
	 * Remove all locally stored accounts
	 */
	removeAllAccounts(): Promise<void>;
	/**
	 * Add a new request (current timestamp) to the pending requests, remove old ones and check if we are above the limit
	 */
	addRequestAndCheckIfRateLimited(): Promise<boolean>;
	/**
	 * This method initializes the client. It will check if the connection should be established to a
	 * browser extension or if the P2P transport should be used.
	 *
	 * @param transport A transport that can be provided by the user
	 */
	init(transport: Transport<any>): Promise<TransportType>;
	/**
	 * Returns the metadata of this DApp
	 */
	getOwnAppMetadata(): Promise<AppMetadata>;
	/**
	 * Return all known peers
	 */
	getPeers(): Promise<PeerInfo[]>;
	/**
	 * Add a new peer to the known peers
	 * @param peer The new peer to add
	 */
	addPeer(peer: PeerInfo): Promise<void>;
	destroy(): Promise<void>;
	/**
	 * A "setter" for when the transport needs to be changed.
	 */
	protected setTransport(transport?: Transport<any>): Promise<void>;
	protected addListener(transport: Transport<any>): Promise<void>;
	protected sendDisconnectToPeer(peer: PeerInfo, transport?: Transport<any>): Promise<void>;
}
declare abstract class CommunicationClient {
	protected readonly keyPair: sodium.KeyPair;
	constructor(keyPair: sodium.KeyPair);
	/**
	 * Get the public key
	 */
	getPublicKey(): Promise<string>;
	/**
	 * get the public key hash
	 */
	getPublicKeyHash(): Promise<string>;
	/**
	 * Create a cryptobox shared key
	 *
	 * @param otherPublicKey
	 * @param selfPrivateKey
	 */
	protected createCryptoBox(otherPublicKey: string, selfPrivateKey: Uint8Array): Promise<[
		Uint8Array,
		Uint8Array,
		Uint8Array
	]>;
	/**
	 * Create a cryptobox server
	 *
	 * @param otherPublicKey
	 * @param selfPrivateKey
	 */
	protected createCryptoBoxServer(otherPublicKey: string, selfPrivateKey: Uint8Array): Promise<sodium.CryptoKX>;
	/**
	 * Create a cryptobox client
	 *
	 * @param otherPublicKey
	 * @param selfPrivateKey
	 */
	protected createCryptoBoxClient(otherPublicKey: string, selfPrivateKey: Uint8Array): Promise<sodium.CryptoKX>;
	/**
	 * Encrypt a message for a specific publicKey (receiver, asymmetric)
	 *
	 * @param recipientPublicKey
	 * @param message
	 */
	protected encryptMessageAsymmetric(recipientPublicKey: string, message: string): Promise<string>;
	abstract unsubscribeFromEncryptedMessages(): Promise<void>;
	abstract unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void>;
	abstract sendMessage(message: string, peer?: P2PPairingRequest | ExtendedP2PPairingResponse | PostMessagePairingRequest | ExtendedPostMessagePairingResponse): Promise<void>;
}
declare abstract class MessageBasedClient extends CommunicationClient {
	protected readonly name: string;
	/**
	 * The listeners that will be notified of new messages
	 */
	protected abstract readonly activeListeners: Map<string, unknown>;
	constructor(name: string, keyPair: sodium.KeyPair);
	/**
	 * start the client and make sure all dependencies are ready
	 */
	start(): Promise<void>;
	/**
	 * Get the pairing request information. This will be shared with the peer during the connection setup
	 */
	getPairingRequestInfo(): Promise<PostMessagePairingRequest>;
	/**
	 * Get the pairing response information. This will be shared with the peer during the connection setup
	 */
	getPairingResponseInfo(request: PostMessagePairingRequest): Promise<PostMessagePairingResponse>;
	/**
	 * Unsubscribe from encrypted messages from a specific peer
	 *
	 * @param senderPublicKey
	 */
	unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void>;
	/**
	 * Unsubscribe from all encrypted messages
	 */
	unsubscribeFromEncryptedMessages(): Promise<void>;
	/**
	 * Decrypt a message from a specific peer
	 *
	 * @param senderPublicKey
	 * @param payload
	 */
	protected decryptMessage(senderPublicKey: string, payload: string): Promise<string>;
	/**
	 * Encrypt a message for a specific publicKey (receiver)
	 *
	 * @param recipientPublicKey
	 * @param message
	 */
	protected encryptMessage(recipientPublicKey: string, message: string): Promise<string>;
	/**
	 * Initialize the connection
	 */
	abstract init(): Promise<void>;
}
declare abstract class Storage {
	/**
	 * Returns a promise that resolves to true if the storage option is available on this platform.
	 */
	static isSupported(): Promise<boolean>;
	/**
	 * Gets a value from storage and returns it
	 *
	 * @param key The storage key
	 */
	abstract get<K extends StorageKey>(key: K): Promise<StorageKeyReturnType[K]>;
	/**
	 * Sets a value in the storage and persist it
	 *
	 * @param key The storage key
	 * @param value The value to be persisted
	 */
	abstract set<K extends StorageKey>(key: K, value: StorageKeyReturnType[K]): Promise<void>;
	/**
	 * Delete a key from storage
	 *
	 * @param key The storage key
	 */
	abstract delete<K extends StorageKey>(key: K): Promise<void>;
}
declare abstract class Transport<T extends PeerInfo = PeerInfo, K extends StorageKey.TRANSPORT_P2P_PEERS_DAPP | StorageKey.TRANSPORT_P2P_PEERS_WALLET | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET = any, S extends CommunicationClient = any> {
	/**
	 * The type of the transport
	 */
	readonly type: TransportType;
	/**
	 * The name of the app
	 */
	protected readonly name: string;
	/**
	 * The status of the transport
	 */
	protected _isConnected: TransportStatus;
	protected readonly peerManager: PeerManager<K>;
	/**
	 * The client handling the encryption/decryption of messages
	 */
	protected client: S;
	/**
	 * The listener that will be invoked when a new peer is connected
	 */
	protected newPeerListener?: (peer: T) => void;
	/**
	 * The listeners that will be notified when new messages are coming in
	 */
	private listeners;
	/**
	 * Return the status of the connection
	 */
	get connectionStatus(): TransportStatus;
	constructor(name: string, client: S, peerManager: PeerManager<K>);
	/**
	 * Returns a promise that resolves to true if the transport is available, false if it is not
	 */
	static isAvailable(): Promise<boolean>;
	/**
	 * Connect the transport
	 */
	connect(): Promise<void>;
	/**
	 * Disconnect the transport
	 */
	disconnect(): Promise<void>;
	/**
	 * Send a message through the transport
	 *
	 * @param message The message to send
	 * @param recipient The recipient of the message
	 */
	send(message: string, peer?: PeerInfo): Promise<void>;
	/**
	 * Add a listener to be called when a new message is received
	 *
	 * @param listener The listener that will be registered
	 */
	addListener(listener: (message: unknown, connectionInfo: ConnectionContext) => void): Promise<void>;
	/**
	 * Remove a listener
	 *
	 * @param listener
	 */
	removeListener(listener: (message: string, connectionInfo: ConnectionContext) => void): Promise<void>;
	getPeers(): Promise<T[]>;
	addPeer(newPeer: T, _sendPairingResponse?: boolean): Promise<void>;
	removePeer(peerToBeRemoved: T): Promise<void>;
	removeAllPeers(): Promise<void>;
	/**
	 * Notify the listeners when a new message comes in
	 *
	 * @param message Message
	 * @param connectionInfo Context info about the connection
	 */
	protected notifyListeners(message: unknown, connectionInfo: ConnectionContext): Promise<void>;
	abstract listen(publicKey: string): Promise<void>;
}
declare class AccountManager {
	private readonly storageManager;
	constructor(storage: Storage);
	getAccounts(): Promise<AccountInfo[]>;
	getAccount(accountIdentifier: string): Promise<AccountInfo | undefined>;
	addAccount(accountInfo: AccountInfo): Promise<void>;
	removeAccount(accountIdentifier: string): Promise<void>;
	removeAccounts(accountIdentifiers: string[]): Promise<void>;
	removeAllAccounts(): Promise<void>;
	hasPermission(message: BeaconMessage): Promise<boolean>;
}
declare class BeaconEventHandler {
	private readonly callbackMap;
	constructor(eventsToOverride?: {
		[key in BeaconEvent]?: {
			handler: BeaconEventHandlerFunction<BeaconEventType[key]>;
		};
	}, overrideAll?: boolean);
	/**
	 * A method to subscribe to a specific beacon event and register a callback
	 *
	 * @param event The event being emitted
	 * @param eventCallback The callback that will be invoked
	 */
	on<K extends BeaconEvent>(event: K, eventCallback: BeaconEventHandlerFunction<BeaconEventType[K]>): Promise<void>;
	/**
	 * Emit a beacon event
	 *
	 * @param event The event being emitted
	 * @param data The data to be emit
	 */
	emit<K extends BeaconEvent>(event: K, data?: BeaconEventType[K], eventCallback?: AlertButton[]): Promise<void>;
	/**
	 * Override beacon event default callbacks. This can be used to disable default alert/toast behaviour
	 *
	 * @param eventsToOverride An object with the events to override
	 */
	private overrideDefaults;
	/**
	 * Set all event callbacks to a specific handler.
	 */
	private setAllHandlers;
}
declare class DAppClient extends Client {
	/**
	 * The block explorer used by the SDK
	 */
	readonly blockExplorer: BlockExplorer;
	preferredNetwork: NetworkType;
	protected postMessageTransport: DappPostMessageTransport | undefined;
	protected p2pTransport: DappP2PTransport | undefined;
	/**
	 * A map of requests that are currently "open", meaning we have sent them to a wallet and are still awaiting a response.
	 */
	private readonly openRequests;
	/**
	 * The currently active account. For all requests that are associated to a specific request (operation request, signing request),
	 * the active account is used to determine the network and destination wallet
	 */
	private _activeAccount;
	/**
	 * The currently active peer. This is used to address a peer in case the active account is not set. (Eg. for permission requests)
	 */
	private _activePeer;
	private _initPromise;
	private readonly activeAccountLoaded;
	private readonly appMetadataManager;
	private readonly disclaimerText?;
	constructor(config: DAppClientOptions);
	initInternalTransports(): Promise<void>;
	init(transport?: Transport<any>): Promise<TransportType>;
	/**
	 * Returns the active account
	 */
	getActiveAccount(): Promise<AccountInfo | undefined>;
	/**
	 * Sets the active account
	 *
	 * @param account The account that will be set as the active account
	 */
	setActiveAccount(account?: AccountInfo): Promise<void>;
	/**
	 * Clear the active account
	 */
	clearActiveAccount(): Promise<void>;
	setColorMode(colorMode: ColorMode): Promise<void>;
	getColorMode(): Promise<ColorMode>;
	/**
	 * @deprecated
	 *
	 * Use getOwnAppMetadata instead
	 */
	getAppMetadata(): Promise<AppMetadata>;
	showPrepare(): Promise<void>;
	hideUI(): Promise<void>;
	/**
	 * Will remove the account from the local storage and set a new active account if necessary.
	 *
	 * @param accountIdentifier ID of the account
	 */
	removeAccount(accountIdentifier: string): Promise<void>;
	/**
	 * Remove all accounts and set active account to undefined
	 */
	removeAllAccounts(): Promise<void>;
	/**
	 * Removes a peer and all the accounts that have been connected through that peer
	 *
	 * @param peer Peer to be removed
	 */
	removePeer(peer: ExtendedPeerInfo, sendDisconnectToPeer?: boolean): Promise<void>;
	/**
	 * Remove all peers and all accounts that have been connected through those peers
	 */
	removeAllPeers(sendDisconnectToPeers?: boolean): Promise<void>;
	/**
	 * Allows the user to subscribe to specific events that are fired in the SDK
	 *
	 * @param internalEvent The event to subscribe to
	 * @param eventCallback The callback that will be called when the event occurs
	 */
	subscribeToEvent<K extends BeaconEvent>(internalEvent: K, eventCallback: BeaconEventHandlerFunction<BeaconEventType[K]>): Promise<void>;
	/**
	 * Check if we have permissions to send the specific message type to the active account.
	 * If no active account is set, only permission requests are allowed.
	 *
	 * @param type The type of the message
	 */
	checkPermissions(type: BeaconMessageType): Promise<boolean>;
	/**
	 * Send a permission request to the DApp. This should be done as the first step. The wallet will respond
	 * with an publicKey and permissions that were given. The account returned will be set as the "activeAccount"
	 * and will be used for the following requests.
	 *
	 * @param input The message details we need to prepare the PermissionRequest message.
	 */
	requestPermissions(input?: RequestPermissionInput): Promise<PermissionResponseOutput>;
	/**
	 * This method will send a "SignPayloadRequest" to the wallet. This method is meant to be used to sign
	 * arbitrary data (eg. a string). It will return the signature in the format of "edsig..."
	 *
	 * @param input The message details we need to prepare the SignPayloadRequest message.
	 */
	requestSignPayload(input: RequestSignPayloadInput): Promise<SignPayloadResponseOutput>;
	/**
	 * This method will send an "EncryptPayloadRequest" to the wallet. This method is meant to be used to encrypt or decrypt
	 * arbitrary data (eg. a string). It will return the encrypted or decrypted payload
	 *
	 * @param input The message details we need to prepare the EncryptPayloadRequest message.
	 */
	/**
	 * This method sends an OperationRequest to the wallet. This method should be used for all kinds of operations,
	 * eg. transaction or delegation. Not all properties have to be provided. Data like "counter" and fees will be
	 * fetched and calculated by the wallet (but they can still be provided if required).
	 *
	 * @param input The message details we need to prepare the OperationRequest message.
	 */
	requestOperation(input: RequestOperationInput): Promise<OperationResponseOutput>;
	/**
	 * Sends a "BroadcastRequest" to the wallet. This method can be used to inject an already signed transaction
	 * to the network.
	 *
	 * @param input The message details we need to prepare the BroadcastRequest message.
	 */
	requestBroadcast(input: RequestBroadcastInput): Promise<BroadcastResponseOutput>;
	protected setActivePeer(peer?: ExtendedPostMessagePairingResponse | ExtendedP2PPairingResponse): Promise<void>;
	/**
	 * A "setter" for when the transport needs to be changed.
	 */
	protected setTransport(transport?: Transport<any>): Promise<void>;
	/**
	 * This method will emit an internal error message.
	 *
	 * @param errorMessage The error message to send.
	 */
	private sendInternalError;
	/**
	 * This method will remove all accounts associated with a specific peer.
	 *
	 * @param peersToRemove An array of peers for which accounts should be removed
	 */
	private removeAccountsForPeers;
	/**
	 * This message handles errors that we receive from the wallet.
	 *
	 * @param request The request we sent
	 * @param beaconError The error we received
	 */
	private handleRequestError;
	/**
	 * This message will send an event when we receive a successful response to one of the requests we sent.
	 *
	 * @param request The request we sent
	 * @param response The response we received
	 */
	private notifySuccess;
	private getWalletInfo;
	private getPeer;
	/**
	 * This method handles sending of requests to the DApp. It makes sure that the DAppClient is initialized and connected
	 * to the transport. After that rate limits and permissions will be checked, an ID is attached and the request is sent
	 * to the DApp over the transport.
	 *
	 * @param requestInput The BeaconMessage to be sent to the wallet
	 * @param account The account that the message will be sent to
	 */
	private makeRequest;
	private disconnect;
	/**
	 * Adds a requests to the "openRequests" set so we know what messages have already been answered/handled.
	 *
	 * @param id The ID of the message
	 * @param promise A promise that resolves once the response for that specific message is received
	 */
	private addOpenRequest;
}
declare class DappP2PTransport extends P2PTransport<ExtendedP2PPairingResponse, StorageKey.TRANSPORT_P2P_PEERS_DAPP> {
	constructor(name: string, keyPair: sodium.KeyPair, storage: Storage, matrixNodes: string[], iconUrl?: string, appUrl?: string);
	startOpenChannelListener(): Promise<void>;
	listenForNewPeer(newPeerListener: (peer: ExtendedP2PPairingResponse) => void): Promise<void>;
	stopListeningForNewPeers(): Promise<void>;
}
declare class DappPostMessageTransport extends PostMessageTransport<ExtendedPostMessagePairingResponse, StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP> {
	constructor(name: string, keyPair: sodium.KeyPair, storage: Storage);
	startOpenChannelListener(): Promise<void>;
	listenForNewPeer(newPeerListener: (peer: ExtendedPostMessagePairingResponse) => void): Promise<void>;
	stopListeningForNewPeers(): Promise<void>;
}
declare class ExposedPromise<T = unknown, U = unknown> {
	private readonly _promise;
	private _resolve;
	private _reject;
	private _status;
	private _promiseResult;
	private _promiseError;
	get promise(): Promise<T>;
	get resolve(): Resolve<T>;
	get reject(): Reject<U>;
	get status(): ExposedPromiseStatus;
	get promiseResult(): T | undefined;
	get promiseError(): U | undefined;
	constructor();
	static resolve<T>(value?: T): ExposedPromise<T>;
	static reject<T = never, U = unknown>(reason?: U): ExposedPromise<T, U>;
	isPending(): boolean;
	isResolved(): boolean;
	isRejected(): boolean;
	isSettled(): boolean;
}
declare class MatrixMessage<T> {
	readonly type: MatrixMessageType;
	readonly sender: string;
	readonly content: T;
	readonly timestamp: number;
	/**
	 * Construct a message from a message event
	 *
	 * @param event
	 */
	static from(event: MatrixStateEvent): MatrixMessage<unknown> | undefined;
	private constructor();
}
declare class MatrixRoom {
	readonly id: string;
	readonly status: MatrixRoomStatus;
	readonly members: string[];
	messages: MatrixMessage<any>[];
	/**
	 * Reconstruct rooms from a sync response
	 *
	 * @param roomSync
	 */
	static fromSync(roomSync: MatrixSyncRooms): MatrixRoom[];
	/**
	 * Reconstruct a room from an ID or object
	 *
	 * @param roomOrId
	 * @param status
	 */
	static from(roomOrId: string | MatrixRoom, status?: MatrixRoomStatus): MatrixRoom;
	/**
	 * Merge new and old state and remove duplicates
	 *
	 * @param newState
	 * @param previousState
	 */
	static merge(newState: MatrixRoom, previousState?: MatrixRoom): MatrixRoom;
	/**
	 * Create a room from a join
	 *
	 * @param id
	 * @param joined
	 */
	private static fromJoined;
	/**
	 * Create a room from an invite
	 *
	 * @param id
	 * @param invited
	 */
	private static fromInvited;
	/**
	 * Create a room from a leave
	 *
	 * @param id
	 * @param left
	 */
	private static fromLeft;
	/**
	 * Extract members from an event
	 *
	 * @param events
	 */
	private static getMembersFromEvents;
	/**
	 * Extract messages from an event
	 *
	 * @param events
	 */
	private static getMessagesFromEvents;
	/**
	 * Get unique events and remove duplicates
	 *
	 * @param events
	 */
	private static getUniqueEvents;
	private constructor();
}
declare class P2PCommunicationClient extends CommunicationClient {
	private readonly name;
	readonly replicationCount: number;
	private readonly storage;
	private readonly iconUrl?;
	private readonly appUrl?;
	private client;
	private initialEvent;
	private initialListener;
	private readonly KNOWN_RELAY_SERVERS;
	relayServer: ExposedPromise<string> | undefined;
	private readonly activeListeners;
	private readonly ignoredRooms;
	private loginCounter;
	constructor(name: string, keyPair: sodium.KeyPair, replicationCount: number, storage: Storage, matrixNodes: string[], iconUrl?: string | undefined, appUrl?: string | undefined);
	getPairingRequestInfo(): Promise<P2PPairingRequest>;
	getPairingResponseInfo(request: P2PPairingRequest): Promise<P2PPairingResponse>;
	getRelayServer(): Promise<string>;
	tryJoinRooms(roomId: string, retry?: number): Promise<void>;
	start(): Promise<void>;
	stop(): Promise<void>;
	reset(): Promise<void>;
	listenForEncryptedMessage(senderPublicKey: string, messageCallback: (message: string) => void): Promise<void>;
	unsubscribeFromEncryptedMessage(senderPublicKey: string): Promise<void>;
	unsubscribeFromEncryptedMessages(): Promise<void>;
	sendMessage(message: string, peer: P2PPairingRequest | ExtendedP2PPairingResponse): Promise<void>;
	updatePeerRoom(sender: string, roomId: string): Promise<void>;
	deleteRoomIdFromRooms(roomId: string): Promise<void>;
	listenForChannelOpening(messageCallback: (pairingResponse: ExtendedP2PPairingResponse) => void): Promise<void>;
	waitForJoin(roomId: string, retry?: number): Promise<void>;
	sendPairingResponse(pairingRequest: P2PPairingRequest): Promise<void>;
	isTextMessage(content: MatrixClientEventMessageContent<any>): content is MatrixClientEventMessageContent<string>;
	updateRelayServer(sender: string): Promise<void>;
	isChannelOpenMessage(content: MatrixClientEventMessageContent<string>): Promise<boolean>;
	isSender(event: MatrixClientEvent<MatrixClientEventType.MESSAGE>, senderPublicKey: string): Promise<boolean>;
	private getRelevantRoom;
	private getRelevantJoinedRoom;
}
declare class P2PTransport<T extends P2PPairingRequest | ExtendedP2PPairingResponse, K extends StorageKey.TRANSPORT_P2P_PEERS_DAPP | StorageKey.TRANSPORT_P2P_PEERS_WALLET> extends Transport<T, K, P2PCommunicationClient> {
	readonly type: TransportType;
	constructor(name: string, keyPair: sodium.KeyPair, storage: Storage, matrixNodes: string[], storageKey: K, iconUrl?: string, appUrl?: string);
	static isAvailable(): Promise<boolean>;
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	startOpenChannelListener(): Promise<void>;
	getPairingRequestInfo(): Promise<P2PPairingRequest>;
	listen(publicKey: string): Promise<void>;
}
declare class PeerManager<T extends StorageKey.TRANSPORT_P2P_PEERS_DAPP | StorageKey.TRANSPORT_P2P_PEERS_WALLET | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET> {
	private readonly storageManager;
	constructor(storage: Storage, key: T);
	hasPeer(publicKey: string): Promise<boolean>;
	getPeers(): Promise<StorageKeyReturnType[T]>;
	getPeer(publicKey: string): Promise<ArrayElem<StorageKeyReturnType[T]> | undefined>;
	addPeer(peerInfo: ArrayElem<StorageKeyReturnType[T]>): Promise<void>;
	removePeer(publicKey: string): Promise<void>;
	removePeers(publicKeys: string[]): Promise<void>;
	removeAllPeers(): Promise<void>;
}
declare class PostMessageClient extends MessageBasedClient {
	protected readonly activeListeners: Map<string, (message: EncryptedExtensionMessage, context: ConnectionContext) => void>;
	init(): Promise<void>;
	listenForEncryptedMessage(senderPublicKey: string, messageCallback: (message: string, context: ConnectionContext) => void): Promise<void>;
	sendMessage(message: string, peer: PostMessagePairingRequest | ExtendedPostMessagePairingResponse): Promise<void>;
	listenForChannelOpening(messageCallback: (pairingResponse: ExtendedPostMessagePairingResponse) => void): Promise<void>;
	sendPairingRequest(id: string): Promise<void>;
	isChannelOpenMessage(message: any): Promise<boolean>;
	private subscribeToMessages;
}
declare class PostMessageTransport<T extends PostMessagePairingRequest | ExtendedPostMessagePairingResponse, K extends StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP | StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET> extends Transport<T, K, PostMessageClient> {
	readonly type: TransportType;
	constructor(name: string, keyPair: sodium.KeyPair, storage: Storage, storageKey: K);
	static isAvailable(): Promise<boolean>;
	static getAvailableExtensions(): Promise<Extension[]>;
	connect(): Promise<void>;
	startOpenChannelListener(): Promise<void>;
	getPairingRequestInfo(): Promise<PostMessagePairingRequest>;
	listen(publicKey: string): Promise<void>;
}
declare enum BeaconErrorType {
	/**
	 * {@link BroadcastBeaconError}
	 *
	 * Will be returned if the user chooses that the transaction is broadcast but there is an error (eg. node not available).
	 *
	 * Returned by: Broadcast | Operation Request
	 */
	BROADCAST_ERROR = "BROADCAST_ERROR",
	/**
	 * {@link NetworkNotSupportedBeaconError}
	 *
	 * Will be returned if the selected network is not supported by the wallet / extension.
	 *
	 * Returned by: Permission
	 */
	NETWORK_NOT_SUPPORTED = "NETWORK_NOT_SUPPORTED",
	/**
	 * {@link NoAddressBeaconError}
	 *
	 * Will be returned if there is no address present for the protocol / network requested.
	 *
	 * Returned by: Permission
	 */
	NO_ADDRESS_ERROR = "NO_ADDRESS_ERROR",
	/**
	 * {@link NoPrivateKeyBeaconError}
	 *
	 * Will be returned if the private key matching the sourceAddress could not be found.
	 *
	 * Returned by: Sign
	 */
	NO_PRIVATE_KEY_FOUND_ERROR = "NO_PRIVATE_KEY_FOUND_ERROR",
	/**
	 * {@link NotGrantedBeaconError}
	 *
	 * Will be returned if the signature was blocked // (Not needed?) Permission: Will be returned if the permissions requested by the App were not granted.
	 *
	 * Returned by: Sign
	 */
	NOT_GRANTED_ERROR = "NOT_GRANTED_ERROR",
	/**
	 * {@link ParametersInvalidBeaconError}
	 *
	 * Will be returned if any of the parameters are invalid.
	 *
	 * Returned by: Operation Request
	 */
	PARAMETERS_INVALID_ERROR = "PARAMETERS_INVALID_ERROR",
	/**
	 * {@link TooManyOperationsBeaconError}
	 *
	 * Will be returned if too many operations were in the request and they were not able to fit into a single operation group.
	 *
	 * Returned by: Operation Request
	 */
	TOO_MANY_OPERATIONS = "TOO_MANY_OPERATIONS",
	/**
	 * {@link TransactionInvalidBeaconError}
	 *
	 * Will be returned if the transaction is not parsable or is rejected by the node.
	 *
	 * Returned by: Broadcast
	 */
	TRANSACTION_INVALID_ERROR = "TRANSACTION_INVALID_ERROR",
	/**
	 * {@link SignatureTypeNotSupportedBeaconError}
	 *
	 * Will be returned if the signing type is not supported.
	 *
	 * Returned by: Sign
	 */
	SIGNATURE_TYPE_NOT_SUPPORTED = "SIGNATURE_TYPE_NOT_SUPPORTED",
	/**
	 * {@link AbortedBeaconError}
	 *
	 * Will be returned if the request was aborted by the user or the wallet.
	 *
	 * Returned by: Permission | Operation Request | Sign Request | Broadcast
	 */
	ABORTED_ERROR = "ABORTED_ERROR",
	/**
	 * {@link UnknownBeaconError}
	 *
	 * Used as a wildcard if an unexpected error occured.
	 *
	 * Returned by: Permission | Operation Request | Sign Request | Broadcast
	 */
	UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
declare enum BeaconEvent {
	PERMISSION_REQUEST_SENT = "PERMISSION_REQUEST_SENT",
	PERMISSION_REQUEST_SUCCESS = "PERMISSION_REQUEST_SUCCESS",
	PERMISSION_REQUEST_ERROR = "PERMISSION_REQUEST_ERROR",
	OPERATION_REQUEST_SENT = "OPERATION_REQUEST_SENT",
	OPERATION_REQUEST_SUCCESS = "OPERATION_REQUEST_SUCCESS",
	OPERATION_REQUEST_ERROR = "OPERATION_REQUEST_ERROR",
	SIGN_REQUEST_SENT = "SIGN_REQUEST_SENT",
	SIGN_REQUEST_SUCCESS = "SIGN_REQUEST_SUCCESS",
	SIGN_REQUEST_ERROR = "SIGN_REQUEST_ERROR",
	BROADCAST_REQUEST_SENT = "BROADCAST_REQUEST_SENT",
	BROADCAST_REQUEST_SUCCESS = "BROADCAST_REQUEST_SUCCESS",
	BROADCAST_REQUEST_ERROR = "BROADCAST_REQUEST_ERROR",
	ACKNOWLEDGE_RECEIVED = "ACKNOWLEDGE_RECEIVED",
	LOCAL_RATE_LIMIT_REACHED = "LOCAL_RATE_LIMIT_REACHED",
	NO_PERMISSIONS = "NO_PERMISSIONS",
	ACTIVE_ACCOUNT_SET = "ACTIVE_ACCOUNT_SET",
	ACTIVE_TRANSPORT_SET = "ACTIVE_TRANSPORT_SET",
	SHOW_PREPARE = "SHOW_PREPARE",
	HIDE_UI = "HIDE_UI",
	PAIR_INIT = "PAIR_INIT",
	PAIR_SUCCESS = "PAIR_SUCCESS",
	CHANNEL_CLOSED = "CHANNEL_CLOSED",
	INTERNAL_ERROR = "INTERNAL_ERROR",
	UNKNOWN = "UNKNOWN"
}
declare enum BeaconMessageType {
	PermissionRequest = "permission_request",
	SignPayloadRequest = "sign_payload_request",
	OperationRequest = "operation_request",
	BroadcastRequest = "broadcast_request",
	PermissionResponse = "permission_response",
	SignPayloadResponse = "sign_payload_response",
	OperationResponse = "operation_response",
	BroadcastResponse = "broadcast_response",
	Acknowledge = "acknowledge",
	Disconnect = "disconnect",
	Error = "error"
}
declare enum ColorMode {
	LIGHT = "light",
	DARK = "dark"
}
declare enum ExposedPromiseStatus {
	PENDING = "pending",
	RESOLVED = "resolved",
	REJECTED = "rejected"
}
declare enum ExtensionMessageTarget {
	BACKGROUND = "toBackground",
	PAGE = "toPage",
	EXTENSION = "toExtension"
}
declare enum MatrixClientEventType {
	INVITE = "invite",
	MESSAGE = "message"
}
declare enum MatrixMessageType {
	TEXT = "m.text"
}
declare enum MatrixRoomStatus {
	UNKNOWN = 0,
	JOINED = 1,
	INVITED = 2,
	LEFT = 3
}
declare enum NetworkType {
	MAINNET = "mainnet",
	DELPHINET = "delphinet",
	EDONET = "edonet",
	FLORENCENET = "florencenet",
	GRANADANET = "granadanet",
	CUSTOM = "custom"
}
declare enum Origin {
	WEBSITE = "website",
	EXTENSION = "extension",
	P2P = "p2p"
}
declare enum PermissionScope {
	SIGN = "sign",
	OPERATION_REQUEST = "operation_request",
	ENCRYPT = "encrypt",
	THRESHOLD = "threshold"
}
declare enum SigningType {
	RAW = "raw",
	OPERATION = "operation",
	MICHELINE = "micheline"
}
declare enum StorageKey {
	TRANSPORT_P2P_PEERS_DAPP = "beacon:communication-peers-dapp",
	TRANSPORT_P2P_PEERS_WALLET = "beacon:communication-peers-wallet",
	TRANSPORT_POSTMESSAGE_PEERS_DAPP = "beacon:postmessage-peers-dapp",
	TRANSPORT_POSTMESSAGE_PEERS_WALLET = "beacon:postmessage-peers-wallet",
	ACCOUNTS = "beacon:accounts",
	ACTIVE_ACCOUNT = "beacon:active-account",
	BEACON_SDK_SECRET_SEED = "beacon:sdk-secret-seed",
	APP_METADATA_LIST = "beacon:app-metadata-list",
	PERMISSION_LIST = "beacon:permissions",
	BEACON_SDK_VERSION = "beacon:sdk_version",
	MATRIX_PRESERVED_STATE = "beacon:sdk-matrix-preserved-state",
	MATRIX_PEER_ROOM_IDS = "beacon:matrix-peer-rooms",
	MATRIX_SELECTED_NODE = "beacon:matrix-selected-node",
	MULTI_NODE_SETUP_DONE = "beacon:multi-node-setup"
}
declare enum TezosOperationType {
	ENDORSEMENT = "endorsement",
	SEED_NONCE_REVELATION = "seed_nonce_revelation",
	DOUBLE_ENDORSEMENT_EVIDENCE = "double_endorsement_evidence",
	DOUBLE_BAKING_EVIDENCE = "double_baking_evidence",
	ACTIVATE_ACCOUNT = "activate_account",
	PROPOSALS = "proposals",
	BALLOT = "ballot",
	REVEAL = "reveal",
	TRANSACTION = "transaction",
	ORIGINATION = "origination",
	DELEGATION = "delegation"
}
declare enum TransportStatus {
	NOT_CONNECTED = "NOT_CONNECTED",
	CONNECTING = "CONNECTING",
	CONNECTED = "CONNECTED"
}
declare enum TransportType {
	CHROME_MESSAGE = "chrome_message",
	POST_MESSAGE = "post_message",
	LEDGER = "ledger",
	P2P = "p2p"
}
declare global {
	interface Window {
		beacon: typeof import("@airgap/beacon-sdk");
		walletUtils: {
			TezosToolkit: typeof import("@taquito/taquito").TezosToolkit;
			BeaconWallet: typeof BeaconWallet;
			validateAddress: typeof import("@taquito/utils").validateAddress;
		};
	}
}
declare type AccountIdentifier = string;
declare type ArrayElem<A> = A extends (infer Elem)[] ? Elem : never;
declare type BeaconEventHandlerFunction<T = unknown> = (data: T, eventCallback?: AlertButton[]) => void | Promise<void>;
declare type BeaconMessage = PermissionRequest | PermissionResponse | OperationRequest | OperationResponse | SignPayloadRequest | SignPayloadResponse | BroadcastRequest | BroadcastResponse | AcknowledgeResponse | DisconnectMessage | ErrorResponse;
declare type BeaconRequestMessage = PermissionRequest | OperationRequest | SignPayloadRequest | BroadcastRequest;
declare type BroadcastResponseOutput = BroadcastResponse;
declare type ExtendedP2PPairingResponse = P2PPairingResponse & {
	senderId: string;
};
declare type ExtendedPeerInfo = PeerInfo & {
	senderId: string;
};
declare type ExtendedPostMessagePairingResponse = PostMessagePairingResponse & {
	senderId: string;
	extensionId: string;
};
declare type MatrixClientEventContent<T> = T extends MatrixClientEventType.INVITE ? MatrixClientEventInviteContent : T extends MatrixClientEventType.MESSAGE ? MatrixClientEventMessageContent<unknown> : never;
declare type MichelineMichelsonV1Expression = {
	int: string;
} | {
	string: string;
} | {
	bytes: string;
} | MichelineMichelsonV1Expression[] | {
	prim: MichelsonPrimitives;
	args?: MichelineMichelsonV1Expression[];
	annots?: string[];
};
declare type MichelsonPrimitives = "ADD" | "IF_NONE" | "SWAP" | "set" | "nat" | "CHECK_SIGNATURE" | "IF_LEFT" | "LAMBDA" | "Elt" | "CREATE_CONTRACT" | "NEG" | "big_map" | "map" | "or" | "BLAKE2B" | "bytes" | "SHA256" | "SET_DELEGATE" | "CONTRACT" | "LSL" | "SUB" | "IMPLICIT_ACCOUNT" | "PACK" | "list" | "PAIR" | "Right" | "contract" | "GT" | "LEFT" | "STEPS_TO_QUOTA" | "storage" | "TRANSFER_TOKENS" | "CDR" | "SLICE" | "PUSH" | "False" | "SHA512" | "CHAIN_ID" | "BALANCE" | "signature" | "DUG" | "SELF" | "EMPTY_BIG_MAP" | "LSR" | "OR" | "XOR" | "lambda" | "COMPARE" | "key" | "option" | "Unit" | "Some" | "UNPACK" | "NEQ" | "INT" | "pair" | "AMOUNT" | "DIP" | "ABS" | "ISNAT" | "EXEC" | "NOW" | "LOOP" | "chain_id" | "string" | "MEM" | "MAP" | "None" | "address" | "CONCAT" | "EMPTY_SET" | "MUL" | "LOOP_LEFT" | "timestamp" | "LT" | "UPDATE" | "DUP" | "SOURCE" | "mutez" | "SENDER" | "IF_CONS" | "RIGHT" | "CAR" | "CONS" | "LE" | "NONE" | "IF" | "SOME" | "GET" | "Left" | "CAST" | "int" | "SIZE" | "key_hash" | "unit" | "DROP" | "EMPTY_MAP" | "NIL" | "DIG" | "APPLY" | "bool" | "RENAME" | "operation" | "True" | "FAILWITH" | "parameter" | "HASH_KEY" | "EQ" | "NOT" | "UNIT" | "Pair" | "ADDRESS" | "EDIV" | "CREATE_ACCOUNT" | "GE" | "ITER" | "code" | "AND";
declare type OperationResponseOutput = OperationResponse;
declare type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;
declare type PartialTezosDelegationOperation = Optional<TezosDelegationOperation, omittedProperties>;
declare type PartialTezosOperation = TezosActivateAccountOperation | TezosBallotOperation | PartialTezosDelegationOperation | TezosDoubleBakingEvidenceOperation | TezosEndorsementOperation | PartialTezosOriginationOperation | TezosProposalOperation | PartialTezosRevealOperation | TezosSeedNonceRevelationOperation | PartialTezosTransactionOperation;
declare type PartialTezosOriginationOperation = Optional<TezosOriginationOperation, omittedProperties>;
declare type PartialTezosRevealOperation = Optional<TezosRevealOperation, omittedProperties>;
declare type PartialTezosTransactionOperation = Optional<TezosTransactionOperation, omittedProperties>;
declare type PermissionResponseOutput = PermissionResponse & {
	address: string;
	accountInfo: AccountInfo;
};
declare type Reject<U> = (reason?: U) => void;
declare type Resolve<T> = (value?: T) => void;
declare type SignPayloadResponseOutput = SignPayloadResponse;
declare type omittedProperties = "source" | "fee" | "counter" | "gas_limit" | "storage_limit";
export declare class BeaconWallet implements WalletProvider {
	client: DAppClient;
	constructor(options: DAppClientOptions);
	private validateRequiredScopesOrFail;
	requestPermissions(request?: RequestPermissionInput): Promise<void>;
	getPKH(): Promise<string>;
	mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>): Promise<any>;
	mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>): Promise<any>;
	mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>): Promise<any>;
	formatParameters(params: any): any;
	removeDefaultParams(params: WalletTransferParams | WalletOriginateParams | WalletDelegateParams, operatedParams: any): any;
	sendOperations(params: any[]): Promise<string>;
	/**
	 *
	 * @description Removes all beacon values from the storage. After using this method, this instance is no longer usable.
	 * You will have to instanciate a new BeaconWallet.
	 */
	disconnect(): Promise<void>;
	/**
	 *
	 * @description This method removes the active account from local storage by setting it to undefined.
	 */
	clearActiveAccount(): Promise<void>;
}
interface AccountInfo extends PermissionEntity {
	accountIdentifier: AccountIdentifier;
	senderId: string;
	origin: {
		type: Origin;
		id: string;
	};
	publicKey: string;
	connectedAt: number;
}
interface AcknowledgeResponse extends BeaconBaseMessage {
	type: BeaconMessageType.Acknowledge;
}
interface AlertButton {
	text: string;
	style?: "solid" | "outline";
	actionCallback?(): Promise<void>;
}
interface AppMetadata {
	senderId: string;
	name: string;
	icon?: string;
}
interface BeaconBaseMessage {
	type: BeaconMessageType;
	version: string;
	id: string;
	senderId: string;
}
interface BeaconClientOptions {
	/**
	 * Name of the application
	 */
	name: string;
	/**
	 * A URL to the icon of the application
	 */
	iconUrl?: string;
	/**
	 * A URL to the website of the application
	 */
	appUrl?: string;
	/**
	 * The storage that will be used by the SDK
	 */
	storage: Storage;
}
interface BeaconEventType {
	[BeaconEvent.PERMISSION_REQUEST_SENT]: RequestSentInfo;
	[BeaconEvent.PERMISSION_REQUEST_SUCCESS]: {
		account: AccountInfo;
		output: PermissionResponseOutput;
		blockExplorer: BlockExplorer;
		connectionContext: ConnectionContext;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.PERMISSION_REQUEST_ERROR]: {
		errorResponse: ErrorResponse;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.OPERATION_REQUEST_SENT]: RequestSentInfo;
	[BeaconEvent.OPERATION_REQUEST_SUCCESS]: {
		account: AccountInfo;
		output: OperationResponseOutput;
		blockExplorer: BlockExplorer;
		connectionContext: ConnectionContext;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.OPERATION_REQUEST_ERROR]: {
		errorResponse: ErrorResponse;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.SIGN_REQUEST_SENT]: RequestSentInfo;
	[BeaconEvent.SIGN_REQUEST_SUCCESS]: {
		output: SignPayloadResponseOutput;
		connectionContext: ConnectionContext;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.SIGN_REQUEST_ERROR]: {
		errorResponse: ErrorResponse;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.BROADCAST_REQUEST_SENT]: RequestSentInfo;
	[BeaconEvent.BROADCAST_REQUEST_SUCCESS]: {
		network: Network;
		output: BroadcastResponseOutput;
		blockExplorer: BlockExplorer;
		connectionContext: ConnectionContext;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.BROADCAST_REQUEST_ERROR]: {
		errorResponse: ErrorResponse;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.ACKNOWLEDGE_RECEIVED]: {
		message: AcknowledgeResponse;
		extraInfo: ExtraInfo;
		walletInfo: WalletInfo;
	};
	[BeaconEvent.LOCAL_RATE_LIMIT_REACHED]: undefined;
	[BeaconEvent.NO_PERMISSIONS]: undefined;
	[BeaconEvent.ACTIVE_ACCOUNT_SET]: AccountInfo;
	[BeaconEvent.ACTIVE_TRANSPORT_SET]: Transport;
	[BeaconEvent.SHOW_PREPARE]: {
		walletInfo?: WalletInfo;
	};
	[BeaconEvent.HIDE_UI]: undefined;
	[BeaconEvent.PAIR_INIT]: {
		p2pPeerInfo: () => Promise<P2PPairingRequest>;
		postmessagePeerInfo: () => Promise<PostMessagePairingRequest>;
		preferredNetwork: NetworkType;
		abortedHandler?(): void;
		disclaimerText?: string;
	};
	[BeaconEvent.PAIR_SUCCESS]: ExtendedPostMessagePairingResponse | ExtendedP2PPairingResponse;
	[BeaconEvent.CHANNEL_CLOSED]: string;
	[BeaconEvent.INTERNAL_ERROR]: string;
	[BeaconEvent.UNKNOWN]: undefined;
}
interface BroadcastRequest extends BeaconBaseMessage {
	type: BeaconMessageType.BroadcastRequest;
	network: Network;
	signedTransaction: string;
}
interface BroadcastResponse extends BeaconBaseMessage {
	type: BeaconMessageType.BroadcastResponse;
	transactionHash: string;
}
interface ClientOptions {
	/**
	 * Name of the application
	 */
	name: string;
	/**
	 * A URL to the icon of the application
	 */
	iconUrl?: string;
	/**
	 * A URL to the website of the application
	 */
	appUrl?: string;
	/**
	 * The storage that will be used by the SDK
	 */
	storage: Storage;
	/**
	 * An object that will be used to overwrite default event handler behaviour.
	 *
	 * If you plan to overwrite all default events, use "disableDefaultEvents" instead.
	 *
	 * This will overwrite the default event handler, so this can lead to unexpected behavior in some cases.
	 * We recommend that you overwrite all handlers if you want to use your own UI.
	 *
	 * If you simply want to be notified of events happening, but do not want to overwrite the default behavior,
	 * please use `subscribeToEvent()` on the DAppClient instead.
	 */
	eventHandlers?: {
		[key in BeaconEvent]?: {
			handler: BeaconEventHandlerFunction<BeaconEventType[key]>;
		};
	};
	/**
	 * Disable all default Events and UI elements. If passed together with "eventHandlers",
	 * the default eventHandlers will be removed, and the ones passed by the user will be added.
	 */
	disableDefaultEvents?: boolean;
	/**
	 * A list of matrix nodes to connect to. If a non-empty array is passed, the default options will be overwritten.
	 * One node will be randomly selected based on the local keypair and the other nodes will be used as a fallback in case the primary node goes down.
	 *
	 * Only provide the hostname, no https:// prefix. Eg. ['matrix.example.com']
	 */
	matrixNodes?: string[];
}
interface ConnectionContext {
	origin: Origin;
	id: string;
	extras?: {
		sender: chrome.runtime.MessageSender;
		sendResponse(response?: unknown): void;
	};
}
interface DAppClientOptions {
	/**
	 * Name of the application
	 */
	name: string;
	/**
	 * A URL to the icon of the application
	 */
	iconUrl?: string;
	/**
	 * A URL to the website of the application
	 */
	appUrl?: string;
	/**
	 * The storage that will be used by the SDK
	 */
	storage?: Storage;
	/**
	 * An object that will be used to overwrite default event handler behaviour.
	 *
	 * If you plan to overwrite all default events, use "disableDefaultEvents" instead.
	 *
	 * This will overwrite the default event handler, so this can lead to unexpected behavior in some cases.
	 * We recommend that you overwrite all handlers if you want to use your own UI.
	 *
	 * If you simply want to be notified of events happening, but do not want to overwrite the default behavior,
	 * please use `subscribeToEvent()` on the DAppClient instead.
	 */
	eventHandlers?: {
		[key in BeaconEvent]?: {
			handler: BeaconEventHandlerFunction<BeaconEventType[key]>;
		};
	};
	/**
	 * Disable all default Events and UI elements. If passed together with "eventHandlers",
	 * the default eventHandlers will be removed, and the ones passed by the user will be added.
	 */
	disableDefaultEvents?: boolean;
	/**
	 * A list of matrix nodes to connect to. If a non-empty array is passed, the default options will be overwritten.
	 * One node will be randomly selected based on the local keypair and the other nodes will be used as a fallback in case the primary node goes down.
	 *
	 * Only provide the hostname, no https:// prefix. Eg. ['matrix.example.com']
	 */
	matrixNodes?: string[];
	/**
	 * The block explorer used by the SDK
	 */
	blockExplorer?: BlockExplorer;
	/**
	 * Indicates on which network the DApp is planning to run. This is currently used to adjust the URLs of web-wallets in the pairing alert if they use different URLs for testnets.
	 * You will still have to define the network you intend to use during the permission request.
	 */
	preferredNetwork?: NetworkType;
	/**
	 * Set the color mode for the UI elements (alerts and toasts)
	 */
	colorMode?: ColorMode;
	/**
	 * A disclaimer text that will be displayed in the pairing alert
	 */
	disclaimerText?: string;
}
interface DisconnectMessage extends BeaconBaseMessage {
	type: BeaconMessageType.Disconnect;
}
interface EncryptedExtensionMessage<U = unknown> {
	target: ExtensionMessageTarget;
	targetId?: string;
	sender?: U;
	encryptedPayload: string;
}
interface ErrorResponse extends BeaconBaseMessage {
	type: BeaconMessageType.Error;
	errorType: BeaconErrorType;
	errorData?: any;
}
interface Extension {
	id: string;
	name: string;
	shortName?: string;
	iconUrl?: string;
	color?: string;
}
interface ExtraInfo {
	resetCallback?(): Promise<void>;
}
interface MatrixClientEvent<T extends MatrixClientEventType> {
	type: T;
	content: MatrixClientEventContent<T>;
	timestamp?: number;
}
interface MatrixClientEventInviteContent {
	roomId: string;
	members: string[];
}
interface MatrixClientEventMessageContent<T> {
	roomId: string;
	message: MatrixMessage<T>;
}
interface MatrixState {
	isRunning: boolean;
	userId: string | undefined;
	deviceId: string | undefined;
	txnNo: number;
	accessToken: string | undefined;
	syncToken: string | undefined;
	pollingTimeout: number | undefined;
	pollingRetries: number;
	rooms: MatrixRoom[] | Record<string, MatrixRoom>;
}
interface MatrixStateEvent {
	type: string;
	sender: string;
	content: unknown;
	event_id?: string;
	origin_server_ts: number;
}
interface MatrixSyncInvitedRoom {
	invite_state: {
		events: MatrixStateEvent[];
	};
}
interface MatrixSyncJoinedRoom {
	state: {
		events: MatrixStateEvent[];
	};
	timeline: {
		events: MatrixStateEvent[];
	};
}
interface MatrixSyncLeftRoom {
	state: {
		events: MatrixStateEvent[];
	};
	timeline: {
		events: MatrixStateEvent[];
	};
}
interface MatrixSyncRooms {
	join: {
		[key: string]: MatrixSyncJoinedRoom;
	};
	invite: {
		[key: string]: MatrixSyncInvitedRoom;
	};
	leave: {
		[key: string]: MatrixSyncLeftRoom;
	};
}
interface Network {
	type: NetworkType;
	name?: string;
	rpcUrl?: string;
}
interface OperationRequest extends BeaconBaseMessage {
	type: BeaconMessageType.OperationRequest;
	network: Network;
	operationDetails: PartialTezosOperation[];
	sourceAddress: string;
}
interface OperationResponse extends BeaconBaseMessage {
	type: BeaconMessageType.OperationResponse;
	transactionHash: string;
}
interface P2PPairingRequest extends PeerInfo {
	id: string;
	type: "p2p-pairing-request";
	name: string;
	publicKey: string;
	relayServer: string;
	icon?: string;
	appUrl?: string;
}
interface P2PPairingResponse extends PeerInfo {
	id: string;
	type: "p2p-pairing-response";
	name: string;
	publicKey: string;
	relayServer: string;
	icon?: string;
	appUrl?: string;
}
interface PeerInfo {
	name: string;
	publicKey: string;
	version: string;
}
interface PermissionEntity {
	address: string;
	network: Network;
	scopes: PermissionScope[];
	threshold?: Threshold;
}
interface PermissionInfo extends PermissionEntity {
	accountIdentifier: string;
	senderId: string;
	appMetadata: AppMetadata;
	website: string;
	publicKey: string;
	connectedAt: number;
}
interface PermissionRequest extends BeaconBaseMessage {
	type: BeaconMessageType.PermissionRequest;
	appMetadata: AppMetadata;
	network: Network;
	scopes: PermissionScope[];
}
interface PermissionResponse extends BeaconBaseMessage {
	type: BeaconMessageType.PermissionResponse;
	appMetadata: AppMetadata;
	publicKey: string;
	network: Network;
	scopes: PermissionScope[];
	threshold?: Threshold;
}
interface PostMessagePairingRequest extends PeerInfo {
	id: string;
	type: "postmessage-pairing-request";
	name: string;
	publicKey: string;
	icon?: string;
	appUrl?: string;
}
interface PostMessagePairingResponse extends PeerInfo {
	id: string;
	type: "postmessage-pairing-response";
	name: string;
	publicKey: string;
	icon?: string;
	appUrl?: string;
}
interface RequestBroadcastInput {
	network?: Network;
	signedTransaction: string;
}
interface RequestOperationInput {
	operationDetails: PartialTezosOperation[];
}
interface RequestPermissionInput {
	network?: Network;
	scopes?: PermissionScope[];
}
interface RequestSentInfo {
	extraInfo: ExtraInfo;
	walletInfo: WalletInfo;
}
interface RequestSignPayloadInput {
	signingType?: SigningType;
	payload: string;
	sourceAddress?: string;
}
interface SignPayloadRequest extends BeaconBaseMessage {
	type: BeaconMessageType.SignPayloadRequest;
	signingType: SigningType;
	payload: string;
	sourceAddress: string;
}
interface SignPayloadResponse extends BeaconBaseMessage {
	type: BeaconMessageType.SignPayloadResponse;
	signingType: SigningType;
	signature: string;
}
interface StorageKeyReturnType {
	[StorageKey.TRANSPORT_P2P_PEERS_DAPP]: P2PPairingRequest[];
	[StorageKey.TRANSPORT_P2P_PEERS_WALLET]: ExtendedP2PPairingResponse[];
	[StorageKey.TRANSPORT_POSTMESSAGE_PEERS_DAPP]: PostMessagePairingRequest[];
	[StorageKey.TRANSPORT_POSTMESSAGE_PEERS_WALLET]: ExtendedPostMessagePairingResponse[];
	[StorageKey.ACCOUNTS]: AccountInfo[];
	[StorageKey.ACTIVE_ACCOUNT]: AccountIdentifier | undefined;
	[StorageKey.BEACON_SDK_SECRET_SEED]: string | undefined;
	[StorageKey.APP_METADATA_LIST]: AppMetadata[];
	[StorageKey.PERMISSION_LIST]: PermissionInfo[];
	[StorageKey.BEACON_SDK_VERSION]: string | undefined;
	[StorageKey.MATRIX_PRESERVED_STATE]: Partial<MatrixState>;
	[StorageKey.MATRIX_PEER_ROOM_IDS]: {
		[key: string]: string | undefined;
	};
	[StorageKey.MATRIX_SELECTED_NODE]: string | undefined;
	[StorageKey.MULTI_NODE_SETUP_DONE]: boolean | undefined;
}
interface TezosActivateAccountOperation extends TezosBaseOperation {
	kind: TezosOperationType.ACTIVATE_ACCOUNT;
	pkh: string;
	secret: string;
}
interface TezosBallotOperation extends TezosBaseOperation {
	kind: TezosOperationType.BALLOT;
	source: string;
	period: string;
	proposal: string;
	ballot: "nay" | "yay" | "pass";
}
interface TezosBaseOperation {
	kind: TezosOperationType;
}
interface TezosBlockHeader {
	level: number;
	proto: number;
	predecessor: string;
	timestamp: string;
	validation_pass: number;
	operations_hash: string;
	fitness: string[];
	context: string;
	priority: number;
	proof_of_work_nonce: string;
	signature: string;
}
interface TezosDelegationOperation extends TezosBaseOperation {
	kind: TezosOperationType.DELEGATION;
	source: string;
	fee: string;
	counter: string;
	gas_limit: string;
	storage_limit: string;
	delegate?: string;
}
interface TezosDoubleBakingEvidenceOperation extends TezosBaseOperation {
	kind: TezosOperationType.DOUBLE_BAKING_EVIDENCE;
	bh1: TezosBlockHeader;
	bh2: TezosBlockHeader;
}
interface TezosEndorsementOperation extends TezosBaseOperation {
	kind: TezosOperationType.ENDORSEMENT;
	level: string;
}
interface TezosOriginationOperation extends TezosBaseOperation {
	kind: TezosOperationType.ORIGINATION;
	source: string;
	fee: string;
	counter: string;
	gas_limit: string;
	storage_limit: string;
	balance: string;
	delegate?: string;
	script: string;
}
interface TezosProposalOperation extends TezosBaseOperation {
	kind: TezosOperationType.PROPOSALS;
	period: string;
	proposals: string[];
}
interface TezosRevealOperation extends TezosBaseOperation {
	kind: TezosOperationType.REVEAL;
	source: string;
	fee: string;
	counter: string;
	gas_limit: string;
	storage_limit: string;
	public_key: string;
}
interface TezosSeedNonceRevelationOperation extends TezosBaseOperation {
	kind: TezosOperationType.SEED_NONCE_REVELATION;
	level: string;
	nonce: string;
}
interface TezosTransactionOperation extends TezosBaseOperation {
	kind: TezosOperationType.TRANSACTION;
	source: string;
	fee: string;
	counter: string;
	gas_limit: string;
	storage_limit: string;
	amount: string;
	destination: string;
	parameters?: TezosTransactionParameters;
}
interface TezosTransactionParameters {
	entrypoint: "default" | "root" | "do" | "set_delegate" | "remove_delegate" | string;
	value: MichelineMichelsonV1Expression;
}
interface Threshold {
	amount: string;
	timeframe: string;
}
interface WalletInfo {
	name: string;
	type?: "extension" | "mobile" | "web" | "desktop";
	icon?: string;
	deeplink?: string;
}

export as namespace CryptoClockUtils;

export {};

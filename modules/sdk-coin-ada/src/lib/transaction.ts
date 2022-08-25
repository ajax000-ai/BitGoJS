import {
  BaseKey,
  BaseTransaction,
  Entry,
  InvalidTransactionError,
  TransactionType,
  TransactionExplanation,
} from '@bitgo/sdk-core';
import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import { KeyPair } from './keyPair';
import { BaseCoin as CoinConfig } from '@bitgo/statics';

export interface TransactionInput {
  transaction_id: string;
  transaction_index: number;
}

export interface TransactionOutput {
  address: string;
  amount: string;
}

export interface Witness {
  publicKey: string;
  signature: string;
}
/**
 * The transaction data returned from the toJson() function of a transaction
 */
export interface TxData {
  id: string;
  type: TransactionType;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  witnesses: Witness[];
}

export class Transaction extends BaseTransaction {
  private _transaction: CardanoWasm.Transaction;
  private _fee: string;

  constructor(coinConfig: Readonly<CoinConfig>) {
    super(coinConfig);
  }

  get transaction(): CardanoWasm.Transaction {
    return this._transaction;
  }

  set transaction(tx: CardanoWasm.Transaction) {
    this._transaction = tx;
    this._id = Buffer.from(CardanoWasm.hash_transaction(tx.body()).to_bytes()).toString('hex');
  }

  /** @inheritdoc */
  canSign(key: BaseKey): boolean {
    try {
      new KeyPair({ prv: key.key });
      return true;
    } catch {
      return false;
    }
  }

  toBroadcastFormat(): string {
    if (!this._transaction) {
      throw new InvalidTransactionError('Empty transaction data');
    }
    return Buffer.from(this._transaction.to_bytes()).toString('hex');
  }

  /** @inheritdoc */
  toJson(): TxData {
    if (!this._transaction) {
      throw new InvalidTransactionError('Empty transaction data');
    }

    const result: TxData = {
      id: this.id,
      type: this._type as TransactionType,
      inputs: [],
      outputs: [],
      witnesses: [],
    };

    for (let i = 0; i < this._transaction.body().inputs().len(); i++) {
      const input = this._transaction.body().inputs().get(i);
      result.inputs.push({
        transaction_id: Buffer.from(input.transaction_id().to_bytes()).toString('hex'),
        transaction_index: input.index(),
      });
    }

    for (let i = 0; i < this._transaction.body().outputs().len(); i++) {
      const output = this._transaction.body().outputs().get(i);
      result.outputs.push({
        address: output.address().to_bech32(),
        amount: output.amount().coin().to_str(),
      });
    }

    if (this._transaction.witness_set().vkeys() !== undefined) {
      const vkeys = this._transaction.witness_set().vkeys() as CardanoWasm.Vkeywitnesses;
      for (let i = 0; i < vkeys.len(); i++) {
        const vkey = (this._transaction.witness_set().vkeys() as CardanoWasm.Vkeywitnesses).get(i);
        result.witnesses.push({
          publicKey: vkey?.vkey().public_key().to_bech32(),
          signature: vkey?.signature().to_hex(),
        });
      }
    }

    return result;
  }

  /**
   * Build input and output field for this transaction
   *
   */
  loadInputsAndOutputs(): void {
    const outputs: Entry[] = [];
    const inputs: Entry[] = [];

    const tx_outputs = this._transaction.body().outputs();
    for (let i = 0; i < tx_outputs.len(); i++) {
      const output = tx_outputs.get(i);
      outputs.push({
        address: output.address().to_bech32(),
        value: output.amount().coin().to_str(),
      });
    }

    this._outputs = outputs;
    this._inputs = inputs;
  }

  /** @inheritdoc */
  get signablePayload(): Buffer {
    return Buffer.from(CardanoWasm.hash_transaction(this._transaction.body()).to_bytes());
  }

  /**
   * Sets this transaction payload
   *
   * @param rawTx
   */
  fromRawTransaction(rawTx: string): void {
    const HEX_REGEX = /^[0-9a-fA-F]+$/;
    const bufferRawTransaction = HEX_REGEX.test(rawTx) ? Buffer.from(rawTx, 'hex') : Buffer.from(rawTx, 'base64');
    try {
      const txn = CardanoWasm.Transaction.from_bytes(bufferRawTransaction);
      this._transaction = txn;
      this._id = Buffer.from(CardanoWasm.hash_transaction(txn.body()).to_bytes()).toString('hex');
      this._type = TransactionType.Send;
      this._fee = txn.body().fee().to_str();
      this.loadInputsAndOutputs();
    } catch (e) {
      throw new InvalidTransactionError('unable to build transaction from raw');
    }
  }

  /**
   * Set the transaction type.
   *
   * @param {TransactionType} transactionType The transaction type to be set.
   */
  setTransactionType(transactionType: TransactionType): void {
    this._type = transactionType;
  }

  /** @inheritdoc */
  explainTransaction(): TransactionExplanation {
    const txJson = this.toJson();
    const displayOrder = ['id', 'outputAmount', 'changeAmount', 'outputs', 'changeOutputs', 'fee', 'type'];
    const amount = txJson.outputs.map((o) => ({ amount: BigInt(o.amount) }));
    const outputAmount = amount.reduce((p, n) => p + BigInt(n.amount), BigInt('0')).toString();
    return {
      displayOrder,
      id: txJson.id,
      outputs: txJson.outputs.map((o) => ({ address: o.address, amount: o.amount })),
      outputAmount: outputAmount,
      changeOutputs: [],
      changeAmount: '0',
      fee: { fee: this._fee },
    };
  }

  /**
   * Get transaction fee
   */
  get getFee(): string {
    return this._fee;
  }

  /**
   * Set transaction fee
   *
   * @param fee
   */
  fee(fee: string) {
    this._fee = fee;
  }
}

import { BaseCoin as CoinConfig } from '@bitgo/statics';
import EthereumAbi from 'ethereumjs-abi';
import { BuildTransactionError, TransactionType } from '@bitgo/sdk-core';
import {
  KeyPair,
  Transaction,
  TransactionBuilder as EthLikeTransactionBuilder,
  walletSimpleConstructor,
} from '@bitgo/abstract-eth';
import { getCommon } from './utils';
import { TransferBuilder } from './transferBuilder';
import { walletSimpleByteCode } from './walletUtil';

export class TransactionBuilder extends EthLikeTransactionBuilder {
  protected _transfer!: TransferBuilder;

  constructor(_coinConfig: Readonly<CoinConfig>) {
    super(_coinConfig);
    this._common = getCommon(this._coinConfig.network.type);
    this.transaction = new Transaction(this._coinConfig, this._common);
  }

  /**
   * Returns the smart contract encoded data
   *
   * @param {string[]} addresses - the contract signers
   * @returns {string} - the smart contract encoded data
   */
  protected getContractData(addresses: string[]): string {
    const params = [addresses];
    const resultEncodedParameters = EthereumAbi.rawEncode(walletSimpleConstructor, params)
      .toString('hex')
      .replace('0x', '');
    return walletSimpleByteCode + resultEncodedParameters;
  }

  /** @inheritdoc */
  transfer(data?: string): TransferBuilder {
    if (this._type !== TransactionType.Send) {
      throw new BuildTransactionError('Transfers can only be set for send transactions');
    }
    if (!this._transfer) {
      this._transfer = new TransferBuilder(data);
    }
    return this._transfer;
  }

  publicKey(key: string): void {
    this._sourceKeyPair = new KeyPair({ pub: key });
  }
}

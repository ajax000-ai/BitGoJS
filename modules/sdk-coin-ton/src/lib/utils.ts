import { BaseUtils, isValidEd25519PublicKey } from '@bitgo/sdk-core';
import TonWeb from 'tonweb';

export class Utils implements BaseUtils {
  /** @inheritdoc */
  isValidAddress(address: string): boolean {
    try {
      if (address.length != 48) {
        return false;
      }
      Buffer.from(address, 'base64');
      return true;
    } catch (e) {
      return false;
    }
  }

  /** @inheritdoc */
  isValidBlockId(hash: string): boolean {
    try {
      return Buffer.from(hash, 'base64').length === 32;
    } catch (e) {
      return false;
    }
  }

  /** @inheritdoc */
  isValidPrivateKey(key: string): boolean {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  isValidPublicKey(key: string): boolean {
    return isValidEd25519PublicKey(key);
  }

  /** @inheritdoc */
  isValidSignature(signature: string): boolean {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  isValidTransactionId(txId: string): boolean {
    try {
      return Buffer.from(txId, 'base64').length === 32;
    } catch (e) {
      return false;
    }
  }

  async getAddressFromPublicKey(publicKey: string): Promise<string> {
    const tonweb = new TonWeb(new TonWeb.HttpProvider(''));
    const WalletClass = tonweb.wallet.all['v4R2'];
    const wallet = new WalletClass(tonweb.provider, {
      publicKey: TonWeb.utils.hexToBytes(publicKey),
      wc: 0,
    });
    const address = await wallet.getAddress();
    return address.toString(true, true, true);
  }
}

const utils = new Utils();

export default utils;

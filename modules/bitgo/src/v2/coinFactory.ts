/**
 * @prettier
 */
import { CoinFactory } from '@bitgo/sdk-core';
import { AlgoToken } from '@bitgo/sdk-coin-algo';
import { Bcha, Tbcha } from '@bitgo/sdk-coin-bcha';
import {
  Ada,
  Algo,
  AvaxC,
  AvaxCToken,
  AvaxP,
  Bch,
  Bsv,
  Btc,
  Btg,
  Celo,
  CeloToken,
  Cspr,
  Dash,
  Doge,
  Eos,
  EosToken,
  Erc20Token,
  Etc,
  Eth,
  Eth2,
  FiatEur,
  FiatUsd,
  Gteth,
  Hbar,
  Ltc,
  Ofc,
  OfcToken,
  Polygon,
  Rbtc,
  Sol,
  StellarToken,
  Stx,
  Susd,
  Tada,
  Talgo,
  TavaxC,
  TavaxP,
  Tbch,
  Tbsv,
  Tbtc,
  Tcelo,
  Tcspr,
  Tdash,
  Tdoge,
  Teos,
  Tetc,
  Teth,
  Teth2,
  TfiatEur,
  TfiatUsd,
  Thbar,
  Tltc,
  Tpolygon,
  Trbtc,
  Trx,
  Tsol,
  Tstx,
  Tsusd,
  Ttrx,
  Txlm,
  Txrp,
  Txtz,
  Tzec,
  Xlm,
  Xrp,
  Xtz,
  Zec,
} from './coins';
import { Dot } from './coins/dot';
import { Near, TNear } from '@bitgo/sdk-coin-near';
import { Tdot } from './coins/tdot';
import { tokens } from '../config';
import { SolToken } from '@bitgo/sdk-coin-sol';
import { HbarToken } from './coins/hbarToken';

function registerCoinConstructors(globalCoinFactory: CoinFactory): void {
  globalCoinFactory.register('ada', Ada.createInstance);
  globalCoinFactory.register('algo', Algo.createInstance);
  globalCoinFactory.register('avaxc', AvaxC.createInstance);
  globalCoinFactory.register('avaxp', AvaxP.createInstance);
  globalCoinFactory.register('bch', Bch.createInstance);
  globalCoinFactory.register('bcha', Bcha.createInstance);
  globalCoinFactory.register('bsv', Bsv.createInstance);
  globalCoinFactory.register('btc', Btc.createInstance);
  globalCoinFactory.register('btg', Btg.createInstance);
  globalCoinFactory.register('celo', Celo.createInstance);
  globalCoinFactory.register('cspr', Cspr.createInstance);
  globalCoinFactory.register('dash', Dash.createInstance);
  globalCoinFactory.register('doge', Doge.createInstance);
  globalCoinFactory.register('dot', Dot.createInstance);
  globalCoinFactory.register('eos', Eos.createInstance);
  globalCoinFactory.register('etc', Etc.createInstance);
  globalCoinFactory.register('eth', Eth.createInstance);
  globalCoinFactory.register('eth2', Eth2.createInstance);
  globalCoinFactory.register('fiateur', FiatEur.createInstance);
  globalCoinFactory.register('fiatusd', FiatUsd.createInstance);
  globalCoinFactory.register('gteth', Gteth.createInstance);
  globalCoinFactory.register('hbar', Hbar.createInstance);
  globalCoinFactory.register('ltc', Ltc.createInstance);
  globalCoinFactory.register('near', Near.createInstance);
  globalCoinFactory.register('ofc', Ofc.createInstance);
  globalCoinFactory.register('polygon', Polygon.createInstance);
  globalCoinFactory.register('rbtc', Rbtc.createInstance);
  globalCoinFactory.register('sol', Sol.createInstance);
  globalCoinFactory.register('stx', Stx.createInstance);
  globalCoinFactory.register('susd', Susd.createInstance);
  globalCoinFactory.register('tada', Tada.createInstance);
  globalCoinFactory.register('talgo', Talgo.createInstance);
  globalCoinFactory.register('tavaxc', TavaxC.createInstance);
  globalCoinFactory.register('tavaxp', TavaxP.createInstance);
  globalCoinFactory.register('tbch', Tbch.createInstance);
  globalCoinFactory.register('tbcha', Tbcha.createInstance);
  globalCoinFactory.register('tbsv', Tbsv.createInstance);
  globalCoinFactory.register('tbtc', Tbtc.createInstance);
  globalCoinFactory.register('tcelo', Tcelo.createInstance);
  globalCoinFactory.register('tcspr', Tcspr.createInstance);
  globalCoinFactory.register('tdash', Tdash.createInstance);
  globalCoinFactory.register('tdoge', Tdoge.createInstance);
  globalCoinFactory.register('tdot', Tdot.createInstance);
  globalCoinFactory.register('teos', Teos.createInstance);
  globalCoinFactory.register('tetc', Tetc.createInstance);
  globalCoinFactory.register('teth', Teth.createInstance);
  globalCoinFactory.register('teth2', Teth2.createInstance);
  globalCoinFactory.register('tfiateur', TfiatEur.createInstance);
  globalCoinFactory.register('tfiatusd', TfiatUsd.createInstance);
  globalCoinFactory.register('thbar', Thbar.createInstance);
  globalCoinFactory.register('tltc', Tltc.createInstance);
  globalCoinFactory.register('tnear', TNear.createInstance);
  globalCoinFactory.register('tpolygon', Tpolygon.createInstance);
  globalCoinFactory.register('trbtc', Trbtc.createInstance);
  globalCoinFactory.register('trx', Trx.createInstance);
  globalCoinFactory.register('tsol', Tsol.createInstance);
  globalCoinFactory.register('tstx', Tstx.createInstance);
  globalCoinFactory.register('tsusd', Tsusd.createInstance);
  globalCoinFactory.register('ttrx', Ttrx.createInstance);
  globalCoinFactory.register('txlm', Txlm.createInstance);
  globalCoinFactory.register('txrp', Txrp.createInstance);
  globalCoinFactory.register('txtz', Txtz.createInstance);
  globalCoinFactory.register('tzec', Tzec.createInstance);
  globalCoinFactory.register('xlm', Xlm.createInstance);
  globalCoinFactory.register('xrp', Xrp.createInstance);
  globalCoinFactory.register('xtz', Xtz.createInstance);
  globalCoinFactory.register('zec', Zec.createInstance);

  Erc20Token.createTokenConstructors().forEach(({ name, coinConstructor }) => {
    globalCoinFactory.register(name, coinConstructor);
  });

  for (const token of [...tokens.bitcoin.xlm.tokens, ...tokens.testnet.xlm.tokens]) {
    const tokenConstructor = StellarToken.createTokenConstructor(token);
    globalCoinFactory.register(token.type, tokenConstructor);
  }

  for (const ofcToken of [...tokens.bitcoin.ofc.tokens, ...tokens.testnet.ofc.tokens]) {
    const tokenConstructor = OfcToken.createTokenConstructor(ofcToken);
    globalCoinFactory.register(ofcToken.type, tokenConstructor);
  }

  CeloToken.createTokenConstructors().forEach(({ name, coinConstructor }) => {
    globalCoinFactory.register(name, coinConstructor);
  });

  for (const token of [...tokens.bitcoin.eos.tokens, ...tokens.testnet.eos.tokens]) {
    const tokenConstructor = EosToken.createTokenConstructor(token);
    globalCoinFactory.register(token.type, tokenConstructor);
    globalCoinFactory.register(token.tokenContractAddress, tokenConstructor);
  }

  AlgoToken.createTokenConstructors().forEach(({ name, coinConstructor }) => {
    globalCoinFactory.register(name, coinConstructor);
  });

  AvaxCToken.createTokenConstructors().forEach(({ name, coinConstructor }) => {
    globalCoinFactory.register(name, coinConstructor);
  });

  SolToken.createTokenConstructors().forEach(({ name, coinConstructor }) => {
    globalCoinFactory.register(name, coinConstructor);
  });

  for (const token of [...tokens.bitcoin.hbar.tokens, ...tokens.testnet.hbar.tokens]) {
    const tokenConstructor = HbarToken.createTokenConstructor(token);
    globalCoinFactory.register(token.type, tokenConstructor);
  }
}

const GlobalCoinFactory: CoinFactory = new CoinFactory();

registerCoinConstructors(GlobalCoinFactory);

export default GlobalCoinFactory;

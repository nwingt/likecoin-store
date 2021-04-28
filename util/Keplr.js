/* eslint-disable max-len */
/* eslint-disable prefer-template */
import network from './cosmos/network';
import { timeout } from '@/util/misc';

function configToKeplrCoin(denom) {
  const c = network.coinLookup.find(coin => coin.viewDenom === denom);
  return {
    coinDenom: c.viewDenom,
    coinMinimalDenom: c.chainDenom,
    coinDecimals: c.chainToViewConversionFactor
      .toString()
      .split('.')[1].length,
    coinGeckoId: c.coinGeckoId,
  };
}

class Keplr {
  constructor() {
    this.offlineSigner = null;
    this.accounts = [];
    this.inited = false;
  }

  async initKeplr() {
    if (this.inited) return true;
    if (!window.keplr) {
      let tries = 0;
      while (window.keplr > tries) {
        // eslint-disable-next-line no-await-in-loop
        await timeout(1000);
        tries += 1;
      }
    }
    if (window.keplr && window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain({
          chainId: network.id,
          chainName: network.name,
          rpc: network.rpcURL,
          rest: network.apiURL,
          stakeCurrency: configToKeplrCoin(network.stakingDenom),
          // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
          // The 'stake' button in Keplr extension will link to the webpage.
          // walletUrlForStaking: "",
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: network.addressPrefix,
            bech32PrefixAccPub: network.addressPrefix + 'pub',
            bech32PrefixValAddr: network.addressPrefix + 'valoper',
            bech32PrefixValPub: network.addressPrefix + 'valoperpub',
            bech32PrefixConsAddr: network.addressPrefix + 'valcons',
            bech32PrefixConsPub: network.addressPrefix + 'valconspub',
          },
          currencies: network.coinLookup.map(({ viewDenom }) => configToKeplrCoin(viewDenom)),
          feeCurrencies: network.coinLookup.map(({ viewDenom }) => configToKeplrCoin(viewDenom)),
          // (Optional) The number of the coin type.
          // This field is only used to fetch the address from ENS.
          // Ideally, it is recommended to be the same with BIP44 path's coin type.
          // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
          // So, this is separated to support such chains.
          coinType: 118,
          // (Optional) This is used to set the fee of the transaction.
          // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
          // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
          // gasPriceStep: {
          //     low: 0.01,
          //     average: 0.025,
          //     high: 0.04
          // }
        });
        await window.keplr.enable(network.id);

        const offlineSigner = window.getOfflineSigner(network.id);
        this.signer = offlineSigner;
        this.accounts = await offlineSigner.getAccounts();
        this.inited = true;
        return true;
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  }

  async getKeplrSigner() {
    if (!this.inited) {
      const res = await this.initKeplr();
      if (!res) throw new Error('CANNOT_INIT_KEPLR');
    }
    return this.signer;
  }

  getWalletAddress() {
    const [wallet = {}] = this.accounts;
    return wallet.address;
  }

  async signLogin(signPayload) {
    if (!this.inited) {
      const res = await this.initKeplr();
      if (!res) throw new Error('CANNOT_INIT_KEPLR');
    }
    const message = {
      chain_id: network.id,
      memo: signPayload,
      msgs: [],
      fee: { gas: '1', amount: { denom: 'nanolike', amount: '0' } },
    };
    const payload = await this.signer.sign(
      this.accounts[0].address,
      message,
    );
    return { message, ...payload };
  }

  async prepareCosmosTxSigner() {
    if (!this.inited) {
      const res = await this.initKeplr();
      if (!res) throw new Error('CANNOT_INIT_KEPLR');
    }
    const signerInstance = this.signer;
    return async function signer(signMessage) {
      const data = JSON.parse(signMessage);
      const dataWithSign = await signerInstance.sign(this.accounts[0].address, data);
      const signObject = dataWithSign.signature;
      return {
        signature: Buffer.from(signObject.signature, 'base64'),
        publicKey: Buffer.from(signObject.pub_key.value, 'base64'),
      };
    };
  }
}

export default new Keplr();
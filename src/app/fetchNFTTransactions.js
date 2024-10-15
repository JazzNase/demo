const axios = require('axios');
require('dotenv').config();

const POLYGONSCAN_API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY;
const CONTRACT_ADDRESS = '0xedc38b1ff69dd823c251e7094d6ddfd42af9aba4';

async function fetchNFTTransactions() {
  try {
    const url = `https://api.polygonscan.com/api`;
    const params = {
      module: 'account',
      action: 'tokennfttx',
      contractaddress: CONTRACT_ADDRESS,
      startblock: 0,
      endblock: 99999999,
      sort: 'desc',
      apikey: POLYGONSCAN_API_KEY
    };

    const response = await axios.get(url, { params });

    if (response.data.status === '1') {
      console.log('NFT Transactions:', response.data.result);
      return response.data.result;
    } else {
      console.error('Error fetching NFT transactions:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

fetchNFTTransactions();
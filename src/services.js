import axios from 'axios';

export const getTradingPair = async () => {
  try {
    const { data: pairs } = await axios.get(
      'https://www.bitstamp.net/api/v2/trading-pairs-info'
    );
    return pairs;
  } catch (ex) {
    return ex;
  }
};

export const subscribeOrUnsubscribe = (client, value, event) => {
  try {
    client.send(
      JSON.stringify({
        event: `bts:${event}`,
        data: {
          channel: `order_book_${value}`
        }
      })
    );
  } catch (ex) {
    return ex;
  }
};

import React, { Component } from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import { w3cwebsocket } from 'websocket';
import { getTradingPair, subscribeOrUnsubscribe } from './services';
import Bids from './Bids';

const Client = new w3cwebsocket('wss://ws.bitstamp.net');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { pairs: [], orderBook: {}, value: '' };
  }

  async componentDidMount() {
    const pairs = await getTradingPair();
    if (pairs.length > 0) {
      const currencyPairs = pairs.map(pair => {
        return {
          value: pair.url_symbol,
          text: pair.name
        };
      });
      this.setState({ pairs: currencyPairs });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      Client.onmessage = event => {
        const { data } = event;
        const res = JSON.parse(data);
        if (Object.keys(res).length > 1) {
          this.setState({ orderBook: res.data });
        }
      };
    }
  }

  subscribe = (e, { value }) => {
    const { isSubscribe, value: currentValue } = this.state;
    if (isSubscribe) {
      subscribeOrUnsubscribe(Client, currentValue, 'unsubscribe')
    }
    subscribeOrUnsubscribe(Client, value, 'subscribe');
    this.setState({ value, isSubscribe: true });
  };

  render() {
    const { pairs, orderBook } = this.state;
    return (
      <React.Fragment>
        <div style={{ marginLeft: '45%' }}>
          <h3>React Crypto order book app</h3>
          <Dropdown
            placeholder='Currency'
            onChange={this.subscribe}
            search
            selection
            options={pairs}
          />
        </div>
        {Object.keys(orderBook).length > 0 && (
          <Grid centered columns={3}>
            <Grid.Column />
            <Grid.Column>
              <p>Bids</p>
              {orderBook.bids.map((bid, index) => <Bids key={index} bid={bid} />)}
            </Grid.Column>
            <Grid.Column>
              <p>Asks</p>
              {orderBook.asks.map((ask, index) => <Bids key={index} bid={ask} />)}
            </Grid.Column>
            <Grid.Column />
          </Grid>
        )}
      </React.Fragment>
    );
  }
}

export default App;

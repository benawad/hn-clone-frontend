import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { split, ApolloClient, HttpLink, InMemoryCache, ApolloLink } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { AUTH_TOKEN } from './constants';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });
  return forward(operation);
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  middlewareAuthLink.concat(httpLink),
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);
registerServiceWorker();

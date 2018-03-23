import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import './styles/index.css';

const httpLink = new HttpLink({ uri: 'http://localhost:4000' });

const client = new ApolloClient({
  link: httpLink,
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

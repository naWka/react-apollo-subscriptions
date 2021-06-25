import { InMemoryCache, ApolloProvider, createHttpLink, split, ApolloClient, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition, relayStylePagination } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';
import './App.css';
import SubComp from './SubComp'

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMDczNjBmNC1kMDkyLTQ5YTEtYTUzNC04YTFkYmViNzRjZjYifQ.6IesFG7fZLeWPlahPBDIEJlPD-42J4KM8Fb_9kesY8I';

  // const httpLink = new createHttpLink({
  //   // uri: 'http://localhost:8080/graphql'
  //   // uri: 'https://48p1r2roz4.sse.codesandbox.io'
  //   // uri: 'https://test-api.insense.pro/graphql'
  // });



  // const authLink = setContext((_, { headers }) => {
  //   return {
  //     headers: {
  //       ...headers,
  //       Authorization: `Bearer ${token}`,
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   };
  // });
  
  // const link = split(
  //   ({ query }) => {
  //     const { kind, operation } = getMainDefinition(query);
  //     return kind === 'OperationDefinition' && operation === 'subscription';
  //   },
  //   wsLink,
  //   authLink.concat(httpLink)
  // );


//   console.log({link, wsLink, httpLink})
// const client = new ApolloClient({
//     // link,
//     uri: 'https://48p1r2roz4.sse.codesandbox.io',
//     // connectToDevTools: true,
//     cache: new InMemoryCache(),
//   });



  const httpLink = new HttpLink({
    uri: 'https://test-api.insense.pro/graphql',
    // uri: 'https://48p1r2roz4.sse.codesandbox.io/',
          headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
  });
  
  const wsLink = new WebSocketLink({
    uri: 'wss://test-subscriptions.insense.pro/graphql',
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          authToken: token
        },
      },
      headers: {
        authToken: token,
      }
    },
    
  });

  // const wsLink = new WebSocketLink({
  //   uri: 'wss://test-subscriptions.insense.pro/graphql',
  //   options: {
  //     reconnect: true,
  //     connectionParams: {
  //       headers: {
  //         authToken: token,
  //         // Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   },
  // });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

 const client = new ApolloClient({
  link: splitLink,
  // uri:  'https://48p1r2roz4.sse.codesandbox.io/',
  // uri: 'https://test-api.insense.pro/graphql',
  cache: new InMemoryCache()
});
function App() {
  return (
    <ApolloProvider client={client} > 
    <div className="App">
      <SubComp />
    </div>
    </ApolloProvider>

  );
}

export default App;

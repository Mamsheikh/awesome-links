import '../styles/tailwind.css';
import Layout from '../components/Layout';
import { ApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;

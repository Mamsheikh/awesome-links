import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { AwesomeLink } from '../components/AwesomeLink';

const AllLinksQuery = gql`
  query allLinksQuery {
    links {
      imageUrl
      url
      title
      category
      description
      id
    }
  }
`;

function Home() {
  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery);
  console.log('data', data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  // const { endCursor, hasNextPage } = data?.links.pageInfo;

  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container mx-auto max-w-5xl my-20 px-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {data.links.map((link) => (
            <AwesomeLink
              category={link.category}
              url={link.url}
              id={link.id}
              description={link.description}
              imageUrl={link.imageUrl}
              title={link.title}
              key={link.id}
            />
          ))}
        </div>
        {/* {hasNextPage ? (
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded my-10'
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
              });
            }}
          >
            more
          </button>
        ) : (
          <p className='my-10 text-center font-medium'>
            You've reached the end!
          </p>
        )} */}
      </div>
    </div>
  );
}

export default Home;

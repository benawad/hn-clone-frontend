import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

class LinkList extends React.Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.find(link => link.id === linkId);
    votedLink.votes.push(createVote);

    store.writeQuery({ query: FEED_QUERY, data });
  };

  _subscribeToNewVotes = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newVote {
            node {
              id
              link {
                id
                url
                description
                createdAt
                postedBy {
                  id
                  name
                }
                votes {
                  id
                  user {
                    id
                  }
                }
              }
              user {
                id
              }
            }
          }
        }
      `,
    });
  };

  _subscribeToNewLinks = () => {
    this.props.feedQuery.subscribeToMore({
      document: gql`
        subscription {
          newLink {
            node {
              id
              url
              description
              createdAt
              postedBy {
                id
                name
              }
              votes {
                id
                user {
                  id
                }
              }
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [subscriptionData.data.newLink.node, ...previous.feed.links];
        const result = {
          ...previous,
          feed: {
            links: newAllLinks,
          },
        };
        return result;
      },
    });
  };

  componentDidMount() {
    this._subscribeToNewLinks();
    this._subscribeToNewVotes();
  }

  render() {
    const { feedQuery } = this.props;
    if (feedQuery && feedQuery.loading) {
      return <div>Loading</div>;
    }

    if (feedQuery && feedQuery.error) {
      return <div>Error</div>;
    }

    const linksToRender = feedQuery.feed;

    return (
      <div>
        {linksToRender.map((link, i) => (
          <Link
            updateStoreAfterVote={this._updateCacheAfterVote}
            key={link.id}
            link={link}
            index={i}
          />
        ))}
      </div>
    );
  }
}

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

class LinkList extends Component.PureComponent {
  render() {
    const { feedQuery } = this.props;
    if (feedQuery && feedQuery.loading) {
      return <div>Loading</div>;
    }

    if (feedQuery && feedQuery.error) {
      return <div>Error</div>;
    }

    const { links: linksToRender } = feedQuery.feed;

    return <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>;
  }
}

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

export default graphql(FEED_QUERY, { name: 'feedQuery' })(LinkList);

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { FEED_QUERY } from './LinkList';

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  };

  _createLink = async () => {
    const { description, url } = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url,
      },
      update: (store, { data: { post } }) => {
        const data = store.readQuery({ query: FEED_QUERY });
        data.feed.splice(0, 0, post);
        store.writeQuery({
          query: FEED_QUERY,
          data,
        });
      },
    });
    this.props.history.push('/');
  };

  _onChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            name="description"
            onChange={this._onChange}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            name="url"
            onChange={this._onChange}
            type="text"
            placeholder="The URL for the link"
          />
        </div>

        <button onClick={this._createLink}>Submit</button>
      </div>
    );
  }
}

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
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

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink);

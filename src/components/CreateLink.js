import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
    }
  }
`;

export default graphql(POST_MUTATION, { name: 'postMutation' })(CreateLink);

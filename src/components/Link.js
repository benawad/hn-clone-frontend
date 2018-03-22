import React, { Component } from 'react';

class Link extends Component {
  _voteForLink = async () => {
    // ... you'll implement this in chapter 6
  };

  render() {
    return (
      <div>
        <div>
          {this.props.link.description} ({this.props.link.url})
        </div>
      </div>
    );
  }
}

export default Link;

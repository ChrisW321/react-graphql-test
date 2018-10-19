import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const TITLE = 'React GraphQL GitHub Client';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const GET_ORGANIZATION = `{
  organization(login: "the-road-to-learn-react") {
    name
    url
  }
}`

class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
  }

  componentDidMount() {
    this.onFetchFromGithub();
  }

  onFetchFromGithub() {
    axiosGitHubGraphQL.post('', { query: GET_ORGANIZATION })
    .then(res => console.log(res));
  }

  onChange = e => {
    this.setState({ path: e.target.value})
  }

  onSubmit = e => {
    e.preventDefault();
    //fetch data
  }

  render() {
    const { path } = this.state;
    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            onChange={this.onChange}
            style={{ width: '300px' }}
            value={path}
          />
          <button type="submit">Search</button>
        </form>

        <hr />

        {/* Here comes the result! */}
      </div>
    );
  }
}


export default App;

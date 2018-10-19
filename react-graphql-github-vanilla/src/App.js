import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const TITLE = 'React GraphQL GitHub Client';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_API}`,
  },
});

const getIssuesOfRepositoryQuery = (organization, repository) => `
  {
    organization(login: "${organization}") {
      name
      url
      repository(name: "${repository}") {
        name
        url
        issues(last: 5) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
      }
    }
  }
`;

class App extends Component {
  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
    organization: null,
    errors: null,
  }

  componentDidMount() {
    this.onFetchFromGithub(this.state.path);
  }

  onFetchFromGithub(path) {
    const [organization, repository] = path.split('/');

    axiosGitHubGraphQL.post('', { 
      query: getIssuesOfRepositoryQuery(organization, repository), 
    })
    .then(res => {
      this.setState({
        organization: res.data.data.organization,
        errors: res.data.errors,
      });
      console.log(res.data.data)
    })
    .catch(err => console.error(err));
  }

  onChange = e => {
    this.setState({ path: e.target.value})
  }

  onSubmit = e => {
    e.preventDefault();
    this.onFetchFromGithub(this.state.path)
  }

  render() {
    const { path, organization } = this.state;
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

        {organization && <Organization organization={organization} />}
      </div>
    );
  }
}

const Organization = ({ organization }) => (
  <div>
    <p>
      <strong>Issues from Organization:</strong>
      <a href={organization.url}>{organization.name}</a>
    </p>
    <Repository repository={organization.repository} />
  </div>
);

const Repository = ({ repository }) => (
  <div>
    <p>
      <strong>In Repository:</strong>
      <a href={repository.url}>{repository.name}</a>
    </p>
    <ul>
      {repository.issues.edges.map(issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default App;

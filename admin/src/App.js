import React from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TeamMembers from './components/TeamMembers';
import Services from './components/Services';
import PortfolioItems from './components/PortfolioItems';
import Equipment from './components/Equipment';

function App({ signOut, user }) {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Admin Panel</h1>
        <button onClick={signOut}>Sign out</button>
        <h2>Welcome, {user.username}</h2>
      </header>
      <main>
        <TeamMembers />
        <Services />
        <PortfolioItems />
        <Equipment />
      </main>
    </div>
  );
}

export default withAuthenticator(App);

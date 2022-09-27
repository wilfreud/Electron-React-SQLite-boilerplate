import logo from './logo.svg';
import './App.css';

// This is just an example of what you can do with the api you setup on preload.js
// It returns a promise so you must resolve it
window.api.getInfos()
  .then((data) => console.log(data))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

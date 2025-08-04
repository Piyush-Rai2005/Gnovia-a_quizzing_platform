// src/main.jsx
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Your App component
import { Provider } from 'react-redux'; // Import the Provider from react-redux
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import { store } from './store/store.js'; // Import your Redux store
import './styles/index.css';  // Global CSS file

// Render the App component with Provider wrapping it to make the store accessible
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>  {/* Wrap App with Provider */}
   <BrowserRouter>
    <App />
   </BrowserRouter>
  </Provider>
);

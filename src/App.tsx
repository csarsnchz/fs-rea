import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import Auth from './pages/Auth';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/create-listing" element={
              <PrivateRoute>
                <CreateListing />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}
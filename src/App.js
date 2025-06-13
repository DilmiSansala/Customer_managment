import React, { useState } from 'react';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setView('form');
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setView('form');
  };

  const handleSaveCustomer = () => {
    setView('list');
    setEditingCustomer(null);
    // Force refresh of customer list by remounting component
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleCancel = () => {
    setView('list');
    setEditingCustomer(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            🏢 Customer Management System
          </h1>
          <p className="app-subtitle">
           
          </p>
        </div>
        <div className="header-nav">
          <button 
            onClick={() => setView('list')}
            className={`nav-btn ${view === 'list' ? 'active' : ''}`}
          >
            📋 Customer List
          </button>
          <button 
            onClick={handleAddCustomer}
            className={`nav-btn ${view === 'form' && !editingCustomer ? 'active' : ''}`}
          >
            ➕ Add Customer
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {view === 'list' ? (
          <CustomerList 
            onEditCustomer={handleEditCustomer}
            onAddCustomer={handleAddCustomer}
          />
        ) : (
          <CustomerForm 
            customer={editingCustomer}
            onSave={handleSaveCustomer}
            onCancel={handleCancel}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 Customer Management System. Built with Spring Boot & React.</p>
      </footer>
    </div>
  );
}

export default App;
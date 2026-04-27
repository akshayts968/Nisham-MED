import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SharedFeatureGrid.css';

const FindDoctor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  // Mock Doctors Array
  const doctors = [
    { id: 1, name: 'Dr. Jane Smith', dept: 'Cardiology', exp: '15 Years', rating: '4.9/5', fee: '₹1500' },
    { id: 2, name: 'Dr. John Adams', dept: 'Neurology', exp: '10 Years', rating: '4.8/5', fee: '₹2000' },
    { id: 3, name: 'Dr. Alan Lee', dept: 'Respiratory', exp: '12 Years', rating: '4.7/5', fee: '₹1200' },
    { id: 4, name: 'Dr. Sarah Wong', dept: 'General Practice', exp: '8 Years', rating: '4.9/5', fee: '₹800' }
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' ? true : doc.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="feature-wrapper">
      <div className="feature-header">
        <button className="back-arrow" onClick={() => navigate('/dashboard')}>
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="feature-title">Find A Doctor</h1>
      </div>

      <div className="feature-content" style={{ alignItems: 'normal' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <input 
             type="text" 
             placeholder="Search doctor by name..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', flex: 1, minWidth: '250px' }}
          />
          <select 
             value={filterDept} 
             onChange={(e) => setFilterDept(e.target.value)}
             style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: 'white' }}
          >
             <option value="All">All Departments</option>
             <option value="Cardiology">Cardiology</option>
             <option value="Neurology">Neurology</option>
             <option value="Respiratory">Respiratory</option>
             <option value="General Practice">General Practice</option>
          </select>
        </div>

        <div className="cards-grid">
           {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
             <div key={doc.id} className="mini-card">
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e2e8f0', marginBottom: '1rem' }}></div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{doc.name}</h3>
                <span style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{doc.dept}</span>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                   <span>⭐ {doc.rating}</span>
                   <span>⏱ {doc.exp}</span>
                   <span style={{ color: '#10b981', fontWeight: 'bold' }}>{doc.fee}</span>
                </div>

                <button className="primary-btn" style={{ width: '100%', marginTop: '1rem', padding: '0.6rem' }} onClick={() => navigate('/dashboard/book-appointment', { state: { doctor: `${doc.name} (${doc.dept})`, dept: doc.dept } })}>
                  Book Now
                </button>
             </div>
           )) : (
             <p style={{ color: '#64748b' }}>No doctors found matching your criteria.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;

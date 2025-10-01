import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, LogOut, Settings, UserCheck } from 'lucide-react';
import './admin.css';
import studentsData from './data/students.json';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [staffData, setStaffData] = useState({});

  // Load staff data from JSON file
  useEffect(() => {
    fetch('/staffs.json')
      .then(response => response.json())
      .then(data => setStaffData(data))
      .catch(error => console.error('Error loading staff data:', error));
  }, []);

  const sidebarItems = [
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'students', label: 'Students', icon: GraduationCap }
  ];

  const departments = [
    { 
      id: 'cse', 
      name: 'CSE', 
      fullName: 'Computer Science Engineering',
      items: ['3rd Year Section A', '3rd Year Section B', '4th Year Section A']
    },
    { 
      id: 'it', 
      name: 'IT',  
      fullName: 'Information Technology',
      items: ['3rd Year Section A', '3rd Year Section B', '4th Year Section A']
    },
    { 
      id: 'ece', 
      name: 'ECE', 
      fullName: 'Electronics & Communication',
      items: ['3rd Year Section A', '3rd Year Section B', '4th Year Section A']
    }
  ];

  const renderStaffContent = () => {
    return (
      <div className="content">
        <div className="search-row">
          <div className="search-actions">
            <input className="search-input" type="text" placeholder="staffs" />
          </div>
          <button className="primary-btn">Add New</button>
        </div>
        
        <div className="grid">
          {departments.map((dept) => (
            <div key={dept.id} className="section">
              <div className="flex-start">
                <div className="dept-badge">
                  <span>{dept.name}</span>
                </div>
                <div className="flex-1">
                  <h3 className="dept-title">{dept.fullName}</h3>
                  <div className="items-col">
                    {staffData[dept.id] ? staffData[dept.id].map((staffName, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name">{index + 1}. {staffName}</span>
                        <div className="item-divider"></div>
                        <button className="edit-btn">View</button>
                      </div>
                    )) : (
                      <div className="item-name">Loading staff data...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClassesContent = () => {
    return (
      <div className="content">
        <div className="search-row">
          <div className="search-actions">
            <input className="search-input" type="text" placeholder="classes" />
            <input className="search-input" type="text" placeholder="students" />
          </div>
          <button className="primary-btn">Add New</button>
        </div>
        
        <div className="grid">
          {departments.map((dept) => (
            <div key={dept.id} className="section">
              <div className="flex-start">
                <div className="dept-badge">
                  <span>{dept.name}</span>
                </div>
                <div className="flex-1">
                  <h3 className="dept-title">{dept.fullName}</h3>
                  <div className="items-col">
                    {dept.items.map((item, index) => (
                      <div key={index} className="item-row">
                        <div className="item-dot"></div>
                        <span className="item-name">{item}</span>
                        <div className="item-divider"></div>
                        <button className="edit-btn">Edit</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudentsContent = () => {
    return (
      <div className="content">
        <div className="search-row">
          <div className="search-actions">
            <input className="search-input" type="text" placeholder="students" />
          </div>
          <button className="primary-btn">Add New</button>
        </div>
        
        <div className="grid">
          {departments.map((dept) => (
            <div key={dept.id} className="section">
              <div className="flex-start">
                <div className="dept-badge">
                  <span>{dept.name}</span>
                </div>
                <div className="flex-1">
                  <h3 className="dept-title">{dept.fullName}</h3>
                  <div className="items-col">
                    {dept.items.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="dept-title">{section}</h4>
                        <div className="items-col">
                          {(studentsData?.[dept.id]?.[section] || []).map((studentName, studentIndex) => (
                            <div key={studentIndex} className="item-row">
                              <span className="item-name">{studentIndex + 1}. {studentName}</span>
                              <div className="item-divider"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'staff':
        return renderStaffContent();
      case 'students':
        return renderStudentsContent();
      case 'classes':
      default:
        return renderClassesContent();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="header">
          <h1 className="brand">Admin Panel</h1>
        </div>
        
        <nav className="nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-button${isActive ? ' active' : ''}`}
              >
                <Icon className="icon" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="logout-wrap">
          <button className="logout">
            <LogOut className="icon" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
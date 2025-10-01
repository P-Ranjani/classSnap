import React, { useState } from 'react';
import { Users, BookOpen, GraduationCap, LogOut, Settings, UserCheck } from 'lucide-react';
import './app/src/admin.css';
import staffData from './staffs.json';
import studentsData from './students.json';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('classes');

  // Using statically imported JSON files above

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
          <h2 className="brand">Staff</h2>
          <button className="primary-btn">
            Add [+]
          </button>
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
                    {Array.isArray(staffData[dept.id]) && staffData[dept.id].length > 0 ? (
                      staffData[dept.id].map((staffName, index) => (
                        <div key={index} className="item-row">
                          <span className="item-name">{index + 1}. {staffName}</span>
                          <div className="item-divider"></div>
                          <button className="edit-btn">View</button>
                        </div>
                      ))
                    ) : (
                      <span className="item-name">No staff found</span>
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
          <h2 className="brand">Classes & Schedules</h2>
          <button className="primary-btn">
            Add New class
          </button>
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
          <h2 className="brand">Students</h2>
          <button className="primary-btn">
            Add [+]
          </button>
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
                    {dept.items.map((section, sectionIndex) => {
                      const sectionList = studentsData && studentsData[dept.id] && studentsData[dept.id][section];
                      return (
                        <div key={sectionIndex}>
                          <h4 className="dept-title">{section}</h4>
                          <div className="items-col">
                            {Array.isArray(sectionList) && sectionList.length > 0 ? (
                              sectionList.map((studentName, studentIndex) => (
                                <div key={studentIndex} className="item-row">
                                  <span className="item-name">{studentIndex + 1}. {studentName}</span>
                                  <div className="item-divider"></div>
                                </div>
                              ))
                            ) : (
                              <span className="item-name">No students found</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
        return renderClassesContent();
      default:
        // return renderClassesContent();
        return renderStudentsContent();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="header">
          <h1 className="brand">Admin Panelsdfghjk</h1>
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
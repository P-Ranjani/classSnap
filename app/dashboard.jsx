import React, { useState, useMemo, useEffect } from 'react';

// Attendance history data loaded from JSON file
let attendanceHistory = {};

const PERIODS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // Circular Progress Component
  const CircularProgress = ({ percentage }) => {
  const circumference = 2 * Math.PI * 50;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <svg 
        style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}
        viewBox="0 0 120 120"
      >
          <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#e0e0e0"
          strokeWidth="12"
            fill="transparent"
          />
          <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#4CAF50"
          strokeWidth="12"
            fill="transparent"
          strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333'
      }}>
        {percentage}%
        </div>
      </div>
    );
};

// Student Profile Page Component
const StudentProfile = ({ student, onBack }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const history = attendanceHistory[student.name] || [];
  
  const attendancePercentage = useMemo(() => {
    if (history.length === 0) return 0;
    
    let totalPeriods = 0;
    let presentPeriods = 0;
    
    history.forEach(record => {
      PERIODS.forEach(period => {
        totalPeriods++;
        if (record.periods[period] === 'P') {
          presentPeriods++;
        }
      });
    });
    
    return totalPeriods > 0 ? Math.round((presentPeriods / totalPeriods) * 100) : 0;
  }, [history]);

  const handleViewProfile = () => {
    alert('View Profile clicked - Navigate to detailed profile page');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    alert('Logout clicked - User logged out');
    setShowProfileMenu(false);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <button style={{
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          background: 'none',
          border: 'none',
          padding: '5px 10px'
        }} onClick={onBack}>←</button>
        
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          flex: 1,
          textAlign: 'center'
        }}>{student.name}</div>
        
        <div style={{ position: 'relative' }}>
          <button 
            style={{
              padding: '8px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            Profile
          </button>
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '45px',
              right: '0',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '150px'
            }}>
              <div 
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '14px',
                  color: '#333'
                }}
                onClick={handleViewProfile}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                View Profile
              </div>
              <div 
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333'
                }}
                onClick={handleLogout}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <CircularProgress percentage={attendancePercentage} />
          <div style={{
            marginTop: '10px',
            fontSize: '16px',
            color: '#666'
          }}>Overall Attendance</div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        overflow: 'auto'
      }}>
        <table style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr>
              <th style={{
                backgroundColor: '#f8f9fa',
                padding: '12px 8px',
                textAlign: 'left',
                border: '1px solid #e0e0e0',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '14px',
                width: '140px'
              }}>Day</th>
              {PERIODS.map(period => (
                <th key={period} style={{
                  backgroundColor: '#f8f9fa',
                  padding: '12px 8px',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '14px'
                }}>{period}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((record, index) => (
              <tr key={`${record.date}-${index}`} style={{
                backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
              }}>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'left',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px'
                }}>
                  <div style={{
                    fontWeight: '500',
                    color: '#555'
                  }}>
                    {record.day}
                    <div style={{ fontSize: '11px', color: '#999' }}>{record.date}</div>
                  </div>
                </td>
                {PERIODS.map(period => (
                  <td key={`${record.date}-${period}`} style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    fontSize: '14px'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      backgroundColor: record.periods[period] === 'P' ? '#4CAF50' : '#f44336',
                      color: 'white'
                    }}>
                      {record.periods[period]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
              </div>
            </div>
  );
};

const ClassDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/Anish.json')
      .then(response => response.json())
      .then(data => {
        attendanceHistory = data;
        // Create students array from the JSON data
        const studentsList = Object.keys(data).map((name, index) => {
          // Get the latest attendance record for current day display
          const latestRecord = data[name] && data[name].length > 0 ? data[name][data[name].length - 1] : null;
          return {
            id: index + 1,
            name: name,
            attendance: latestRecord ? latestRecord.periods : { I: 'A', II: 'A', III: 'A', IV: 'A', V: 'A', VI: 'A', VII: 'A' }
          };
        });
        setStudents(studentsList);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading attendance data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading attendance data...
      </div>
    );
  }

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }
  
  const attendanceStats = useMemo(() => {
    let presentStudents = 0;
    let absentStudents = 0;

    students.forEach(student => {
      const allPresent = PERIODS.every(period => student.attendance[period] === 'P');
      if (allPresent) {
        presentStudents++;
      } else {
        absentStudents++;
      }
    });
    
    return {
      present: presentStudents,
      absent: absentStudents,
      percentage: students.length > 0 ? Math.round((presentStudents / students.length) * 100) : 0
    };
  }, [students]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #e0e0e0',
        minHeight: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ marginRight: '15px', fontSize: '20px', color: '#666', cursor: 'pointer' }}>←</span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>CSE - B III YR</span>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
            <svg 
              style={{ width: '120px', height: '120px', transform: 'rotate(-90deg)' }}
              viewBox="0 0 120 120"
            >
              <circle cx="60" cy="60" r="50" stroke="#e0e0e0" strokeWidth="12" fill="transparent" />
              <circle
                cx="60" cy="60" r="50" stroke="#4CAF50" strokeWidth="12" fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 - (attendanceStats.percentage / 100) * 2 * Math.PI * 50}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', fontSize: '24px',
              fontWeight: 'bold', color: '#333'
            }}>
              {attendanceStats.percentage}%
          </div>
        </div>
      </div>

        <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Date:</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{new Date().toLocaleDateString()}</div>
        </div>

        <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Strength:</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{students.length}</div>
        </div>

        <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Present:</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>{attendanceStats.present}</div>
        </div>

        <div style={{ marginBottom: '15px', padding: '10px 0' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Absent:</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f44336' }}>{attendanceStats.absent}</div>
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '20px',
        overflow: 'auto'
      }}>
        <input
          type="text"
          style={{
            width: '100%', maxWidth: '400px', padding: '12px 40px 12px 16px',
            border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px',
            marginBottom: '20px'
          }}
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
            No students found matching your search.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#f8f9fa', padding: '12px 8px', textAlign: 'left', border: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333', width: '200px' }}>Name</th>
                {PERIODS.map(period => (
                  <th key={period} style={{ backgroundColor: '#f8f9fa', padding: '12px 8px', textAlign: 'center', border: '1px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>{period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} style={index % 2 === 1 ? { backgroundColor: '#f9f9f9' } : {}}>
                  <td style={{ padding: '12px 8px', textAlign: 'left', border: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#4CAF50', color: 'white', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                        fontWeight: 'bold', marginRight: '12px'
                      }}>
                        {getInitials(student.name)}
                      </div>
                      <span 
                        style={{
                          fontWeight: '500',
                          color: '#2196F3',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                        onClick={() => setSelectedStudent(student)}
                      >
                        {student.name}
                      </span>
                    </div>
                  </td>
                  {PERIODS.map(period => (
                    <td key={period} style={{ padding: '12px 8px', textAlign: 'center', border: '1px solid #e0e0e0' }}>
                      <button
                        style={{
                          width: '36px', height: '36px', border: 'none',
                          borderRadius: '50%', fontWeight: 'bold', fontSize: '14px',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          backgroundColor: student.attendance[period] === 'P' ? '#4CAF50' : '#f44336',
                          color: 'white'
                        }}
                      >
                        {student.attendance[period]}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClassDashboard;
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
  const [viewType, setViewType] = useState('week'); // 'week' or 'month'
  
  const studentData = attendanceHistory[student.name] || {};
  
  // Handle both old and new data structures
  let history = [];
  let monthlyData = {};
  
  if (studentData.weekly) {
    // New structure
    history = studentData.weekly || [];
    monthlyData = studentData.monthly || {};
  } else if (Array.isArray(studentData)) {
    // Old structure (direct array)
    history = studentData;
    monthlyData = {}; // No monthly data in old structure
  }
  
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
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '300px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRight: '1px solid #e0e0e0',
        minHeight: '100vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button style={{
            marginRight: '15px',
            fontSize: '20px',
            color: '#666',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '5px 10px'
          }} onClick={onBack}>←</button>
          <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}>{student.name}</span>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
            <svg 
              style={{ width: '100px', height: '100px', transform: 'rotate(-90deg)' }}
              viewBox="0 0 120 120"
            >
              <circle cx="60" cy="60" r="50" stroke="#e0e0e0" strokeWidth="12" fill="transparent" />
              <circle
                cx="60" cy="60" r="50" stroke="#4CAF50" strokeWidth="12" fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 - (attendancePercentage / 100) * 2 * Math.PI * 50}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', fontSize: '20px',
              fontWeight: 'bold', color: '#333'
            }}>
              {attendancePercentage}%
            </div>
          </div>
          <div style={{
            fontSize: '18px',
            color: '#666'
          }}>Overall Attendance</div>
        </div>

        <div style={{ marginBottom: '12px', padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '4px' }}>Total Days:</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{history.length}</div>
        </div>

        <div style={{ marginBottom: '12px', padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '4px' }}>Present Days:</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            {history.filter(record => 
              PERIODS.every(period => record.periods[period] === 'P')
            ).length}
          </div>
        </div>

        <div style={{ marginBottom: '12px', padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '4px' }}>Absent Days:</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>
            {history.filter(record => 
              PERIODS.some(period => record.periods[period] === 'A')
            ).length}
        </div>
      </div>

        <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              Profile
            </button>
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                bottom: '45px',
                left: '0',
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
                    fontSize: '16px',
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
                    fontSize: '16px',
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
      </div>

      {/* Right Side - Attendance Table */}
      <div style={{
        flex: 1,
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          flexShrink: 0
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333',
            margin: 0
          }}>
            Attendance History
          </h2>
          
          {/* View Type Icons */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setViewType('week')}
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: viewType === 'week' ? '#4CAF50' : 'white',
                color: viewType === 'week' ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (viewType !== 'week') {
                  e.target.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (viewType !== 'week') {
                  e.target.style.backgroundColor = 'white';
                }
              }}
              title="Week View"
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                <div style={{
                  width: '16px',
                  height: '2px',
                  backgroundColor: viewType === 'week' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  width: '16px',
                  height: '2px',
                  backgroundColor: viewType === 'week' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  width: '16px',
                  height: '2px',
                  backgroundColor: viewType === 'week' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
              </div>
            </button>
            <button
              onClick={() => setViewType('month')}
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: viewType === 'month' ? '#4CAF50' : 'white',
                color: viewType === 'month' ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (viewType !== 'month') {
                  e.target.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (viewType !== 'month') {
                  e.target.style.backgroundColor = 'white';
                }
              }}
              title="Month View"
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2px',
                width: '16px',
                height: '16px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: viewType === 'month' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: viewType === 'month' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: viewType === 'month' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: viewType === 'month' ? 'white' : '#333',
                  borderRadius: '1px'
                }}></div>
              </div>
            </button>
          </div>
        </div>
        
        <div style={{
          flex: 0.9,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          height: '90%'
        }}>
          {viewType === 'week' ? (
            // Week View Table
            <table style={{
              width: '100%',
              height: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              tableLayout: 'fixed'
            }}>
              <thead>
                <tr>
                  <th style={{
                    backgroundColor: '#f8f9fa',
                    padding: '8px 6px',
                    textAlign: 'left',
                    border: '1px solid #e0e0e0',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '16px',
                    width: '20%',
                    height: '40px'
                  }}>Day</th>
                  {PERIODS.map(period => (
                    <th key={period} style={{
                      backgroundColor: '#f8f9fa',
                      padding: '8px 6px',
                      textAlign: 'center',
                      border: '1px solid #e0e0e0',
                      fontWeight: 'bold',
                      color: '#333',
                      fontSize: '16px',
                      width: `${80/PERIODS.length}%`,
                      height: '40px'
                    }}>{period}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ height: '100%' }}>
                {history.map((record, index) => (
                  <tr key={`${record.date}-${index}`} style={{
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9',
                    height: history.length > 0 ? `${90/history.length}%` : 'auto'
                  }}>
                    <td style={{
                      padding: '8px 6px',
                      textAlign: 'left',
                      border: '1px solid #e0e0e0',
                      fontSize: '16px',
                      verticalAlign: 'middle'
                    }}>
                      <div style={{
                        fontWeight: '600',
                        color: '#333',
                        fontSize: '16px'
                      }}>
                        {record.day}
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>{record.date}</div>
                      </div>
                    </td>
                    {PERIODS.map(period => (
                      <td key={`${record.date}-${period}`} style={{
                        padding: '8px 6px',
                        textAlign: 'center',
                        border: '1px solid #e0e0e0',
                        fontSize: '16px',
                        verticalAlign: 'middle'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto',
                          backgroundColor: record.periods[period] === 'P' ? '#4CAF50' : '#f44336',
                          color: 'white',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                          {record.periods[period]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Month View - All Months Calendar Grid
            <div style={{
              height: '100%',
              overflow: 'auto',
              padding: '10px'
            }}>
              {Object.keys(monthlyData).length > 0 ? (
                Object.entries(monthlyData).map(([monthName, monthData]) => (
                <div key={monthName} style={{
                  marginBottom: '30px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '15px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Month Header */}
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '15px',
                    textAlign: 'center',
                    paddingBottom: '10px',
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    {monthName}
                  </div>

                  {/* Day Headers */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '2px',
                    marginBottom: '10px'
                  }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} style={{
                        padding: '8px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#666',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '2px'
                  }}>
                    {monthData.days.map((dayData, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '6px',
                          textAlign: 'center',
                          backgroundColor: dayData.attendance === 'P' ? '#e8f5e8' : '#fdeaea',
                          border: `2px solid ${dayData.attendance === 'P' ? '#4CAF50' : '#f44336'}`,
                          borderRadius: '4px',
                          minHeight: '50px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: '#333',
                          marginBottom: '2px'
                        }}>
                          {dayData.date}
                        </div>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: dayData.attendance === 'P' ? '#4CAF50' : '#f44336',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {dayData.attendance}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
              ) : (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  fontSize: '18px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📅</div>
                    <div>Monthly attendance data not available</div>
                    <div style={{ fontSize: '14px', marginTop: '5px', color: '#999' }}>
                      This student only has weekly attendance records
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
    const studentNames = ['Anish', 'Bharath', 'Catherine', 'Divya', 'Ezhil', 'Gokul', 'Harini', 'Indhu', 'Karthik'];
    
    // Fetch all student JSON files
    const fetchPromises = studentNames.map(name => 
      fetch(`/${name}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${name}`);
          }
          return response.json();
        })
        .catch(error => {
          console.error(`Error loading ${name} data:`, error);
          return null; // Return null for failed requests
        })
    );

    Promise.all(fetchPromises)
      .then(results => {
        // Combine all student data
        const combinedData = {};
        results.forEach((data, index) => {
          if (data) {
            Object.assign(combinedData, data);
          }
        });
        
        console.log('Loaded combined data:', combinedData);
        attendanceHistory = combinedData;
        
        // Create students array from the combined JSON data
        const studentsList = Object.keys(combinedData).map((name, index) => {
          // Get the latest attendance record for current day display
          const studentData = combinedData[name];
          let latestRecord = null;
          
          // Handle both old and new data structures
          if (studentData.weekly && studentData.weekly.length > 0) {
            // New structure with weekly data
            latestRecord = studentData.weekly[studentData.weekly.length - 1];
          } else if (Array.isArray(studentData) && studentData.length > 0) {
            // Old structure (direct array)
            latestRecord = studentData[studentData.length - 1];
          }
          
          return {
            id: index + 1,
            name: name,
            attendance: latestRecord ? latestRecord.periods : { I: 'A', II: 'A', III: 'A', IV: 'A', V: 'A', VI: 'A', VII: 'A' }
          };
        });
        
        console.log('Created students:', studentsList);
        setStudents(studentsList);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading attendance data:', error);
        // Fallback data for testing
        const fallbackStudents = [
          { id: 1, name: 'Anish', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } }
        ];
        setStudents(fallbackStudents);
        setLoading(false);
      });
  }, []);

  // Move useMemo hook before conditional returns to follow Rules of Hooks
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
import React, { useState, useMemo } from 'react';

const ClassDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample student data - 6 present (all periods P), 2 absent (at least one A)
  const [students, setStudents] = useState([
    { id: 1, name: 'Anish', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } },
    { id: 2, name: 'Bharath', attendance: { I: 'A', II: 'P', III: 'P', IV: 'P', V: 'A', VI: 'P', VII: 'P' } },
    { id: 3, name: 'Catherine', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } },
    { id: 4, name: 'Divya', attendance: { I: 'P', II: 'A', III: 'P', IV: 'P', V: 'P', VI: 'A', VII: 'A' } },
    { id: 5, name: 'Ezhil', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } },
    { id: 6, name: 'Gokul', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } },
    { id: 7, name: 'Harini', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } },
    { id: 8, name: 'Indhu', attendance: { I: 'P', II: 'P', III: 'P', IV: 'P', V: 'P', VI: 'P', VII: 'P' } }
  ]);

  const periods = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  
  // Calculate attendance statistics - only fully present students count as present
  const attendanceStats = useMemo(() => {
    let presentStudents = 0;
    let absentStudents = 0;

    students.forEach(student => {
      const allPresent = periods.every(period => student.attendance[period] === 'P');
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

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle attendance
  const toggleAttendance = (studentId, period) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? {
            ...student,
            attendance: {
              ...student.attendance,
              [period]: student.attendance[period] === 'P' ? 'A' : 'P'
            }
          }
        : student
    ));
  };

  // Get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage }) => {
    const circumference = 2 * Math.PI * 50;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
        <svg 
          style={{ width: '120px', height: '120px', transform: 'rotate(-90deg)' }}
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
            strokeDasharray={strokeDasharray}
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
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {percentage}%
        </div>
      </div>
    );
  };

  const styles = {
    dashboardContainer: {
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRight: '1px solid #e0e0e0',
      minHeight: '100vh'
    },
    classHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px'
    },
    backArrow: {
      marginRight: '15px',
      fontSize: '20px',
      color: '#666',
      cursor: 'pointer'
    },
    classTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    },
    statsItem: {
      marginBottom: '15px',
      padding: '10px 0',
      borderBottom: '1px solid #e0e0e0'
    },
    statsLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    statsValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333'
    },
    presentValue: {
      color: '#4CAF50'
    },
    absentValue: {
      color: '#f44336'
    },
    mainContent: {
      flex: 1,
      padding: '20px',
      overflow: 'auto'
    },
    searchBox: {
      width: '100%',
      maxWidth: '400px',
      padding: '12px 40px 12px 16px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      marginBottom: '20px',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='m21 21-4.35-4.35'%3E%3C/path%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center'
    },
    attendanceTable: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      padding: '12px 8px',
      textAlign: 'center',
      border: '1px solid #e0e0e0',
      fontWeight: 'bold',
      color: '#333'
    },
    tableHeaderName: {
      textAlign: 'left',
      width: '200px'
    },
    tableCell: {
      padding: '12px 8px',
      textAlign: 'center',
      border: '1px solid #e0e0e0'
    },
    tableCellName: {
      textAlign: 'left'
    },
    tableRowEven: {
      backgroundColor: '#f9f9f9'
    },
    studentInfo: {
      display: 'flex',
      alignItems: 'center'
    },
    studentAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#4CAF50',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      marginRight: '12px'
    },
    studentName: {
      fontWeight: '500',
      color: '#333'
    },
    attendanceBtn: {
      width: '36px',
      height: '36px',
      border: 'none',
      borderRadius: '50%',
      fontWeight: 'bold',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    attendanceBtnPresent: {
      backgroundColor: '#4CAF50',
      color: 'white'
    },
    attendanceBtnAbsent: {
      backgroundColor: '#f44336',
      color: 'white'
    },
    noResults: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.classHeader}>
          <span style={styles.backArrow}>←</span>
          <span style={styles.classTitle}>CSE - B III YR</span>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <CircularProgress percentage={attendanceStats.percentage} />
        </div>

        <div style={styles.statsItem}>
          <div style={styles.statsLabel}>Date:</div>
          <div style={styles.statsValue}>{new Date().toLocaleDateString()}</div>
        </div>

        <div style={styles.statsItem}>
          <div style={styles.statsLabel}>Strength:</div>
          <div style={styles.statsValue}>8</div>
        </div>

        <div style={styles.statsItem}>
          <div style={styles.statsLabel}>Present:</div>
          <div style={{...styles.statsValue, ...styles.presentValue}}>
            {attendanceStats.present}
          </div>
        </div>

        <div style={{...styles.statsItem, borderBottom: 'none'}}>
          <div style={styles.statsLabel}>Absent:</div>
          <div style={{...styles.statsValue, ...styles.absentValue}}>
            {attendanceStats.absent}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <input
          type="text"
          style={styles.searchBox}
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredStudents.length === 0 ? (
          <div style={styles.noResults}>
            No students found matching your search.
          </div>
        ) : (
          <table style={styles.attendanceTable}>
            <thead>
              <tr>
                <th style={{...styles.tableHeader, ...styles.tableHeaderName}}>Name</th>
                {periods.map(period => (
                  <th key={period} style={styles.tableHeader}>{period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} style={index % 2 === 1 ? styles.tableRowEven : {}}>
                  <td style={{...styles.tableCell, ...styles.tableCellName}}>
                    <div style={styles.studentInfo}>
                      <div style={styles.studentAvatar}>
                        {getInitials(student.name)}
                      </div>
                      <span style={styles.studentName}>{student.name}</span>
                    </div>
                  </td>
                  {periods.map(period => (
                    <td key={period} style={styles.tableCell}>
                      <button
                        onClick={() => toggleAttendance(student.id, period)}
                        style={{
                          ...styles.attendanceBtn,
                          ...(student.attendance[period] === 'P' 
                            ? styles.attendanceBtnPresent 
                            : styles.attendanceBtnAbsent)
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
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
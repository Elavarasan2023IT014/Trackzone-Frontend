import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { gsap } from 'gsap';
import styles from './AdminDashboard.module.css';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Admin data
  const [adminData, setAdminData] = useState({
    name: 'Maria Rodriguez',
    position: 'HR Administrator',
    department: 'Human Resources',
    avatar: '/assets/admin-avatar.png',
    lastLogin: 'Today, 08:45 AM',
  });

  // Employees data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      position: 'Software Developer',
      department: 'Engineering',
      avatar: '/assets/avatar.png',
      status: 'Active',
      checkInTime: '09:02 AM',
      checkOutTime: '--:-- --',
      email: 'alex.j@company.com',
      phone: '(555) 123-4567',
      totalHoursThisWeek: 24.5,
      attendanceRate: 98,
      location: { lat: 40.7128, lng: -74.006 }
    },
    {
      id: 2,
      name: 'Sarah Miller',
      position: 'UX Designer',
      department: 'Design',
      avatar: '/assets/avatar2.png',
      status: 'Active',
      checkInTime: '08:47 AM',
      checkOutTime: '--:-- --',
      email: 'sarah.m@company.com',
      phone: '(555) 987-6543',
      totalHoursThisWeek: 26,
      attendanceRate: 100,
      location: { lat: 40.7142, lng: -74.0078 }
    },
    {
      id: 3,
      name: 'David Chen',
      position: 'Project Manager',
      department: 'Product',
      avatar: '/assets/avatar3.png',
      status: 'Inactive',
      checkInTime: '--:-- --',
      checkOutTime: '--:-- --',
      email: 'david.c@company.com',
      phone: '(555) 456-7890',
      totalHoursThisWeek: 18,
      attendanceRate: 85,
      location: null
    },
  ]);

  // Attendance summary data
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalEmployees: 42,
    presentToday: 38,
    onLeave: 3,
    absent: 1,
    lateArrivals: 5,
    averageWorkHours: 7.8,
  });

  // Notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: 'New leave request from Sarah Miller', time: '10 mins ago', read: false },
    { id: 2, type: 'info', message: 'Monthly attendance report is ready', time: '1 hour ago', read: false },
    { id: 3, type: 'warning', message: 'David Chen is outside geofence boundary', time: '2 hours ago', read: true },
  ]);

  // Geofence data
  const [geofenceData, setGeofenceData] = useState({
    center: { lat: 40.7128, lng: -74.006 },
    radius: 500, // meters
    name: 'Office Headquarters'
  });

  // Recent activity data
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Updated geofence boundary', time: '30 mins ago', user: 'You' },
    { id: 2, action: 'Sent notification to Engineering team', time: '1 hour ago', user: 'You' },
    { id: 3, action: 'Added new employee: James Wilson', time: '2 hours ago', user: 'You' },
    { id: 4, action: 'Generated monthly attendance report', time: 'Yesterday', user: 'System' },
  ]);

  // Form states
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    recipients: 'all', // all, department, individual
    selectedDepartment: '',
    selectedEmployee: '',
    priority: 'normal'
  });

  const [geofenceForm, setGeofenceForm] = useState({
    name: geofenceData.name,
    latitude: geofenceData.center.lat,
    longitude: geofenceData.center.lng,
    radius: geofenceData.radius
  });

  useEffect(() => {
    // GSAP animation for stats cards
    gsap.from('.statCard', {
      duration: 1,
      y: 20,
      opacity: 0,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    });

    // Date updater
    const interval = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddEmployee = () => {
    // Navigation or modal for adding employee
    navigate('/admin-dashboard/add-employee');
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    // Logic to send notification
    const newNotification = {
      id: Date.now(),
      type: 'info',
      message: `Notification sent: ${notificationForm.title}`,
      time: 'Just now',
      user: 'You',
      read: true
    };
    
    setRecentActivity([newNotification, ...recentActivity]);
    setShowNotificationModal(false);
    
    // Reset form
    setNotificationForm({
      title: '',
      message: '',
      recipients: 'all',
      selectedDepartment: '',
      selectedEmployee: '',
      priority: 'normal'
    });
  };

  const handleUpdateGeofence = (e) => {
    e.preventDefault();
    // Logic to update geofence
    setGeofenceData({
      center: { 
        lat: parseFloat(geofenceForm.latitude), 
        lng: parseFloat(geofenceForm.longitude) 
      },
      radius: parseInt(geofenceForm.radius),
      name: geofenceForm.name
    });
    
    const newActivity = {
      id: Date.now(),
      action: `Updated geofence: ${geofenceForm.name}`,
      time: 'Just now',
      user: 'You'
    };
    
    setRecentActivity([newActivity, ...recentActivity]);
    setShowGeofenceModal(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Bar */}
      <motion.div 
        className={styles.topBar}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.dateContainer}>
          <span className={styles.dateLabel}>Date</span>
          <div className={styles.date}>{formatDate(date)}</div>
        </div>
        <div className={styles.clockContainer}>
          <span className={styles.timeLabel}>Time</span>
          <div className={styles.clock}>
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={styles.notificationBell}>
          <span className={styles.notificationCount}>{notifications.filter(n => !n.read).length}</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div className={styles.userInfo}>
          <span>{adminData.name}</span>
          <div className={styles.avatar}>
            <img src={adminData.avatar} alt="Admin avatar" />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <motion.div 
          className={styles.sidebar}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.userProfile}>
            <div className={styles.avatarLarge}>
              <img src={adminData.avatar} alt="Admin avatar" />
            </div>
            <div className={styles.userProfileInfo}>
              <h3>{adminData.name}</h3>
              <p>{adminData.position}</p>
              <p className={styles.department}>{adminData.department}</p>
            </div>
          </div>
          
          <div className={styles.lastLogin}>
            <span className={styles.lastLoginLabel}>Last Login</span>
            <span className={styles.lastLoginValue}>{adminData.lastLogin}</span>
          </div>
          
          <nav className={styles.sidebarNav}>
            <a 
              href="#overview" 
              className={activeTab === 'overview' ? styles.active : ''} 
              onClick={() => setActiveTab('overview')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard Overview
            </a>
            <a 
              href="#employees" 
              className={activeTab === 'employees' ? styles.active : ''} 
              onClick={() => setActiveTab('employees')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Employee Management
            </a>
            <a 
              href="#attendance" 
              className={activeTab === 'attendance' ? styles.active : ''} 
              onClick={() => setActiveTab('attendance')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Attendance Logs
            </a>
            <a 
              href="#geofence" 
              className={activeTab === 'geofence' ? styles.active : ''} 
              onClick={() => setActiveTab('geofence')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
              </svg>
              Geofence Configuration
            </a>
            <a 
              href="#notifications" 
              className={activeTab === 'notifications' ? styles.active : ''} 
              onClick={() => setActiveTab('notifications')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Notifications
            </a>
            <a 
              href="#reports" 
              className={activeTab === 'reports' ? styles.active : ''} 
              onClick={() => setActiveTab('reports')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Reports
            </a>
            <a 
              href="#settings" 
              className={activeTab === 'settings' ? styles.active : ''} 
              onClick={() => setActiveTab('settings')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </a>
          </nav>

          <button onClick={handleLogout} className={styles.logoutBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </motion.div>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <>
              <motion.div 
                className={styles.dashboardHeader}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className={styles.welcomeMessage}>Admin Dashboard</h2>
                <div className={styles.quickActions}>
                  <motion.button 
                    className={`${styles.actionBtn} ${styles.addEmployeeBtn}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddEmployee}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Add Employee
                  </motion.button>
                  <motion.button 
                    className={`${styles.actionBtn} ${styles.notificationBtn}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotificationModal(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    Send Notification
                  </motion.button>
                  <motion.button 
                    className={`${styles.actionBtn} ${styles.geofenceBtn}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGeofenceModal(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="10" r="3"></circle>
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
                    </svg>
                    Configure Geofence
                  </motion.button>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className={styles.statsContainer}>
                <motion.div 
                  className={`${styles.statCard} statCard`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`${styles.statIcon} ${styles.employeesIcon}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>Total Employees</h3>
                    <div className={styles.statValue}>{attendanceSummary.totalEmployees}</div>
                  </div>
                </motion.div>

                <motion.div 
                  className={`${styles.statCard} statCard`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`${styles.statIcon} ${styles.presentIcon}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>Present Today</h3>
                    <div className={styles.statValue}>{attendanceSummary.presentToday}</div>
                  </div>
                </motion.div>

                <motion.div 
                  className={`${styles.statCard} statCard`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`${styles.statIcon} ${styles.leaveIcon}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>On Leave</h3>
                    <div className={styles.statValue}>{attendanceSummary.onLeave}</div>
                  </div>
                </motion.div>

                <motion.div 
                  className={`${styles.statCard} statCard`}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className={`${styles.statIcon} ${styles.hoursIcon}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>Avg. Work Hours</h3>
                    <div className={styles.statValue}>{attendanceSummary.averageWorkHours}h</div>
                  </div>
                </motion.div>
              </div>

              {/* Widgets Container */}
              <div className={styles.widgetsContainer}>
                {/* Employees widget */}
                <motion.div 
                  className={`${styles.widget} ${styles.employeesWidget}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.widgetHeader}>
                    <h3>Active Employees</h3>
                    <Link to="/admin-dashboard/employees" className={styles.viewAll}>View All</Link>
                  </div>
                  <div className={styles.employeesList}>
                    {employees.filter(emp => emp.status === 'Active').map(employee => (
                      <motion.div 
                        key={employee.id} 
                        className={styles.employeeItem}
                        variants={itemVariants}
                      >
                        <div className={styles.employeeAvatar}>
                          <img src={employee.avatar} alt={employee.name} />
                        </div>
                        <div className={styles.employeeInfo}>
                          <h4>{employee.name}</h4>
                          <p>{employee.position}</p>
                        </div>
                        <div className={styles.employeeTime}>
                          <div className={styles.checkInDisplay}>
                            <span className={styles.timeLabel}>Check In</span>
                            <span className={styles.timeValue}>{employee.checkInTime}</span>
                          </div>
                        </div>
                        <button 
                          className={styles.employeeDetailsBtn}
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          Details
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Notifications widget */}
                <motion.div 
                  className={`${styles.widget} ${styles.notificationsWidget}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.widgetHeader}>
                    <h3>Recent Notifications</h3>
                    <Link to="/admin-dashboard/notifications" className={styles.viewAll}>View All</Link>
                  </div>
                  <div className={styles.notificationsList}>
                    {notifications.map(notification => (
                      <motion.div 
                        key={notification.id} 
                        className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                        variants={itemVariants}
                      >
                        <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                        {notification.type === 'alert' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                          )}
                          {notification.type === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          )}
                          {notification.type === 'warning' && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                          )}
                        </div>
                        <div className={styles.notificationContent}>
                          <p>{notification.message}</p>
                          <span className={styles.notificationTime}>{notification.time}</span>
                        </div>
                        <button className={styles.markReadBtn}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Map widget */}
                <motion.div 
                  className={`${styles.widget} ${styles.mapWidget}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.widgetHeader}>
                    <h3>Employee Locations</h3>
                    <button className={styles.refreshBtn}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <polyline points="23 20 23 14 17 14"></polyline>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                      Refresh
                    </button>
                  </div>
                  <div className={styles.mapContainer}>
                    <MapContainer 
                      center={[geofenceData.center.lat, geofenceData.center.lng]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      {/* Geofence circle */}
                      <Circle 
                        center={[geofenceData.center.lat, geofenceData.center.lng]}
                        radius={geofenceData.radius}
                        pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                      />
                      
                      {/* Employee markers */}
                      {employees.filter(emp => emp.location).map(employee => (
                        <Marker 
                          key={employee.id}
                          position={[employee.location.lat, employee.location.lng]}
                        >
                          <Popup>
                            <div className={styles.markerPopup}>
                              <h4>{employee.name}</h4>
                              <p>{employee.position}</p>
                              <p>Check-in: {employee.checkInTime}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </motion.div>

                {/* Recent activity widget */}
                <motion.div 
                  className={`${styles.widget} ${styles.activityWidget}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className={styles.widgetHeader}>
                    <h3>Recent Activity</h3>
                  </div>
                  <div className={styles.activityList}>
                    {recentActivity.map(activity => (
                      <motion.div 
                        key={activity.id} 
                        className={styles.activityItem}
                        variants={itemVariants}
                      >
                        <div className={styles.activityInfo}>
                          <p>
                            <span className={styles.activityUser}>{activity.user}</span> 
                            <span className={styles.activityAction}>{activity.action}</span>
                          </p>
                          <span className={styles.activityTime}>{activity.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Employee Management Tab */}
          {activeTab === 'employees' && (
            <div className={styles.employeesSection}>
              <h2>Employee Management</h2>
              <div className={styles.employeeControls}>
                <div className={styles.searchBar}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input type="text" placeholder="Search employees..." />
                </div>
                <button className={styles.addEmployeeBtn} onClick={handleAddEmployee}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New Employee
                </button>
              </div>
              <div className={styles.employeeTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Total Hours</th>
                      <th>Attendance Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => (
                      <tr key={employee.id}>
                        <td>
                          <div className={styles.employeeCell}>
                            <div className={styles.employeeAvatar}>
                              <img src={employee.avatar} alt={employee.name} />
                            </div>
                            <div className={styles.employeeInfo}>
                              <h4>{employee.name}</h4>
                              <p>{employee.position}</p>
                            </div>
                          </div>
                        </td>
                        <td>{employee.department}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles[employee.status.toLowerCase()]}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td>{employee.totalHoursThisWeek}h</td>
                        <td>
                          <div className={styles.attendanceRate}>
                            <div className={styles.attendanceBar}>
                              <div 
                                className={styles.attendanceFill} 
                                style={{ width: `${employee.attendanceRate}%` }}
                              ></div>
                            </div>
                            <span>{employee.attendanceRate}%</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.viewButton} onClick={() => setSelectedEmployee(employee)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            <button className={styles.editButton}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button className={styles.deleteButton}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented here */}
          {activeTab !== 'overview' && activeTab !== 'employees' && (
            <div className={styles.placeholderSection}>
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p>This section is under development.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h3>Send Notification</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowNotificationModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSendNotification} className={styles.notificationForm}>
              <div className={styles.formGroup}>
                <label htmlFor="notification-title">Title</label>
                <input 
                  id="notification-title"
                  type="text" 
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                  placeholder="Notification Title"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="notification-message">Message</label>
                <textarea 
                  id="notification-message"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                  placeholder="Notification message..."
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Recipients</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="recipients" 
                      value="all"
                      checked={notificationForm.recipients === 'all'}
                      onChange={() => setNotificationForm({...notificationForm, recipients: 'all'})}
                    />
                    All Employees
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="recipients" 
                      value="department"
                      checked={notificationForm.recipients === 'department'}
                      onChange={() => setNotificationForm({...notificationForm, recipients: 'department'})}
                    />
                    Department
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="recipients" 
                      value="individual"
                      checked={notificationForm.recipients === 'individual'}
                      onChange={() => setNotificationForm({...notificationForm, recipients: 'individual'})}
                    />
                    Individual
                  </label>
                </div>
              </div>
              
              {notificationForm.recipients === 'department' && (
                <div className={styles.formGroup}>
                  <label htmlFor="department-select">Select Department</label>
                  <select 
                    id="department-select"
                    value={notificationForm.selectedDepartment}
                    onChange={(e) => setNotificationForm({...notificationForm, selectedDepartment: e.target.value})}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              )}
              
              {notificationForm.recipients === 'individual' && (
                <div className={styles.formGroup}>
                  <label htmlFor="employee-select">Select Employee</label>
                  <select 
                    id="employee-select"
                    value={notificationForm.selectedEmployee}
                    onChange={(e) => setNotificationForm({...notificationForm, selectedEmployee: e.target.value})}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label htmlFor="priority-select">Priority</label>
                <select 
                  id="priority-select"
                  value={notificationForm.priority}
                  onChange={(e) => setNotificationForm({...notificationForm, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowNotificationModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.sendBtn}>
                  Send Notification
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Geofence Modal */}
      {showGeofenceModal && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h3>Configure Geofence</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setShowGeofenceModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateGeofence} className={styles.geofenceForm}>
              <div className={styles.formGroup}>
                <label htmlFor="geofence-name">Geofence Name</label>
                <input 
                  id="geofence-name"
                  type="text" 
                  value={geofenceForm.name}
                  onChange={(e) => setGeofenceForm({...geofenceForm, name: e.target.value})}
                  placeholder="Office Headquarters"
                  required
                />
              </div>
              
              <div className={styles.coordInputs}>
                <div className={styles.formGroup}>
                  <label htmlFor="geofence-lat">Latitude</label>
                  <input 
                    id="geofence-lat"
                    type="number" 
                    step="0.000001"
                    value={geofenceForm.latitude}
                    onChange={(e) => setGeofenceForm({...geofenceForm, latitude: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="geofence-lng">Longitude</label>
                  <input 
                    id="geofence-lng"
                    type="number" 
                    step="0.000001"
                    value={geofenceForm.longitude}
                    onChange={(e) => setGeofenceForm({...geofenceForm, longitude: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="geofence-radius">Radius (meters)</label>
                <input 
                  id="geofence-radius"
                  type="number" 
                  min="50"
                  max="5000"
                  value={geofenceForm.radius}
                  onChange={(e) => setGeofenceForm({...geofenceForm, radius: e.target.value})}
                  required
                />
                <div className={styles.rangeSlider}>
                  <input 
                    type="range" 
                    min="50" 
                    max="5000" 
                    value={geofenceForm.radius}
                    onChange={(e) => setGeofenceForm({...geofenceForm, radius: e.target.value})}
                  />
                </div>
              </div>
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowGeofenceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Save Geofence
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className={styles.modalOverlay}>
          <motion.div 
            className={`${styles.modal} ${styles.employeeModal}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className={styles.modalHeader}>
              <h3>Employee Details</h3>
              <button 
                className={styles.closeModalBtn}
                onClick={() => setSelectedEmployee(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className={styles.employeeDetails}>
              <div className={styles.employeeProfileHeader}>
                <div className={styles.employeeLargeAvatar}>
                  <img src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                </div>
                <div className={styles.employeeProfileInfo}>
                  <h3>{selectedEmployee.name}</h3>
                  <p>{selectedEmployee.position}</p>
                  <span className={`${styles.statusBadge} ${styles[selectedEmployee.status.toLowerCase()]}`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.employeeDetailsTabs}>
                <button className={styles.activeTab}>Profile</button>
                <button>Attendance</button>
                <button>Performance</button>
                <button>Documents</button>
              </div>
              
              <div className={styles.employeeDetailsContent}>
                <div className={styles.detailsSection}>
                  <h4>Contact Information</h4>
                  <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email</span>
                      <span className={styles.detailValue}>{selectedEmployee.email}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Phone</span>
                      <span className={styles.detailValue}>{selectedEmployee.phone}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Department</span>
                      <span className={styles.detailValue}>{selectedEmployee.department}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Employee ID</span>
                      <span className={styles.detailValue}>EMP-{selectedEmployee.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.detailsSection}>
                  <h4>Today's Activity</h4>
                  <div className={styles.activityDetails}>
                    <div className={styles.activityItem}>
                      <span className={styles.activityLabel}>Check In</span>
                      <span className={styles.activityValue}>{selectedEmployee.checkInTime}</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityLabel}>Check Out</span>
                      <span className={styles.activityValue}>{selectedEmployee.checkOutTime}</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityLabel}>Hours This Week</span>
                      <span className={styles.activityValue}>{selectedEmployee.totalHoursThisWeek}h</span>
                    </div>
                    <div className={styles.activityItem}>
                      <span className={styles.activityLabel}>Attendance Rate</span>
                      <span className={styles.activityValue}>{selectedEmployee.attendanceRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.quickActions}>
                  <button className={styles.messageBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    Message
                  </button>
                  <button className={styles.editProfileBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
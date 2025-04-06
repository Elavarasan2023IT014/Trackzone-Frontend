import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    position: 'Software Developer',
    department: 'Engineering',
    avatar: '/assets/avatar.png',
    checkInTime: '09:02 AM',
    checkOutTime: '--:-- --',
    totalHours: '24h 30m',
    remainingLeaves: 12,
    upcomingMeetings: [
      { id: 1, title: 'Weekly Sprint Planning', time: '10:30 AM', host: 'Sarah Miller' },
      { id: 2, title: 'Project Review', time: '02:15 PM', host: 'David Chen' }
    ],
    tasks: [
      { id: 1, title: 'Finish dashboard UI', priority: 'High', status: 'In Progress', deadline: 'Today' },
      { id: 2, title: 'API integration', priority: 'Medium', status: 'To Do', deadline: 'Tomorrow' },
      { id: 3, title: 'Documentation update', priority: 'Low', status: 'In Progress', deadline: '28 Apr' }
    ],
    recentActivity: [
      { id: 1, action: 'Checked in', time: '09:02 AM' },
      { id: 2, action: 'Completed task: Fix login issue', time: 'Yesterday' },
      { id: 3, action: 'Submitted timesheet', time: 'Yesterday' }
    ]
  });

  const [date, setDate] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(true);

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

  const handleCheckOut = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const checkOutTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    setUserData({
      ...userData,
      checkOutTime
    });
    setIsCheckedIn(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

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
        <div classTime={styles.clockContainer}>
          <span className={styles.timeLabel}>Time</span>
          <div className={styles.clock}>
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={styles.userInfo}>
          <span>{userData.name}</span>
          <div className={styles.avatar}>
            <img src={userData.avatar} alt="User avatar" />
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
              <img src={userData.avatar} alt="User avatar" />
            </div>
            <h3>{userData.name}</h3>
            <p>{userData.position}</p>
            <p className={styles.department}>{userData.department}</p>
          </div>
          
          <motion.div 
            className={styles.attendanceCard}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className={styles.attendanceHeader}>
              <h3>Attendance</h3>
              <span className={isCheckedIn ? styles.statusActive : styles.statusInactive}>
                {isCheckedIn ? 'Active' : 'Checked Out'}
              </span>
            </div>
            <div className={styles.timeInfo}>
              <div className={styles.timeBlock}>
                <span className={styles.timeLabel}>Check In</span>
                <span className={styles.timeValue}>{userData.checkInTime}</span>
              </div>
              <div className={styles.timeDivider}></div>
              <div className={styles.timeBlock}>
                <span className={styles.timeLabel}>Check Out</span>
                <span className={styles.timeValue}>{userData.checkOutTime}</span>
              </div>
            </div>
            {isCheckedIn && (
              <motion.button 
                className={styles.checkoutBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckOut}
              >
                Check Out
              </motion.button>
            )}
          </motion.div>

          <nav className={styles.sidebarNav}>
            <Link to="/employee-dashboard" className={styles.active}>Dashboard</Link>
            <Link to="/employee-dashboard/attendance">Attendance Log</Link>
            <Link to="/employee-dashboard/tasks">Tasks & Projects</Link>
            <Link to="/employee-dashboard/leaves">Leave Management</Link>
            <Link to="/employee-dashboard/profile">My Profile</Link>
            <Link to="/employee-dashboard/settings">Settings</Link>
          </nav>

          <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
        </motion.div>

        {/* Dashboard Content */}
        <div className={styles.dashboardContent}>
          <motion.h2 
            className={styles.welcomeMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back, {userData.name.split(' ')[0]}!
          </motion.h2>

          {/* Stats Cards */}
<div className={styles.statsContainer}>
  <motion.div 
    className={`${styles.statCard} statCard`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className={styles.statIcon} data-type="hours">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    </div>
    <div className={styles.statInfo}>
      <h3>Hours This Week</h3>
      <div className={styles.statValue}>{userData.totalHours}</div>
    </div>
  </motion.div>

  <motion.div 
    className={`${styles.statCard} statCard`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className={styles.statIcon} data-type="leaves">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>
    <div className={styles.statInfo}>
      <h3>Available Leaves</h3>
      <div className={styles.statValue}>{userData.remainingLeaves}</div>
    </div>
  </motion.div>

  <motion.div 
    className={`${styles.statCard} statCard`}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className={styles.statIcon} data-type="tasks">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <div className={styles.statInfo}>
      <h3>Tasks Completed</h3>
      <div className={styles.statValue}>7/10</div>
    </div>
  </motion.div>
</div>

          {/* Tasks and Meetings */}
          <div className={styles.widgetsContainer}>
            {/* Tasks widget */}
            <motion.div 
              className={styles.widget}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.widgetHeader}>
                <h3>My Tasks</h3>
                <Link to="/employee-dashboard/tasks" className={styles.viewAll}>View All</Link>
              </div>
              <div className={styles.tasksList}>
                {userData.tasks.map(task => (
                  <motion.div 
                    key={task.id} 
                    className={styles.taskItem}
                    variants={itemVariants}
                  >
                    <div className={styles.taskInfo}>
                      <h4>{task.title}</h4>
                      <div className={styles.taskMeta}>
                        <span className={`${styles.taskPriority} ${styles[`priority${task.priority}`]}`}>
                          {task.priority}
                        </span>
                        <span className={styles.taskDeadline}>{task.deadline}</span>
                      </div>
                    </div>
                    <div className={`${styles.taskStatus} ${styles[task.status.replace(/\s+/g, '')]}`}>
                      {task.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Meetings widget */}
            <motion.div 
              className={styles.widget}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.widgetHeader}>
                <h3>Today's Meetings</h3>
                <Link to="/employee-dashboard/calendar" className={styles.viewAll}>View Calendar</Link>
              </div>
              {userData.upcomingMeetings.length > 0 ? (
                <div className={styles.meetingsList}>
                  {userData.upcomingMeetings.map(meeting => (
                    <motion.div 
                      key={meeting.id} 
                      className={styles.meetingItem}
                      variants={itemVariants}
                    >
                      <div className={styles.meetingTime}>{meeting.time}</div>
                      <div className={styles.meetingInfo}>
                        <h4>{meeting.title}</h4>
                        <p>Host: {meeting.host}</p>
                      </div>
                      <button className={styles.joinBtn}>Join</button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No meetings scheduled for today</p>
              )}
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div 
            className={styles.activityWidget}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className={styles.widgetHeader}>
              <h3>Recent Activity</h3>
            </div>
            <div className={styles.activityList}>
              {userData.recentActivity.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityDot}></div>
                  <div className={styles.activityInfo}>
                    <p>{activity.action}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
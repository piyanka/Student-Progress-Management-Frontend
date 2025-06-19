# 📚 Student Progress Management System

A production-ready web application to manage, monitor, and analyze the competitive programming progress of students on Codeforces. Built with a modular and scalable architecture using the MERN stack.

---

## 🚀 Features

### ✅ Student Table View

* Displays all enrolled students in a tabular format.
* Fields: **Name, Email, Phone, Codeforces Handle, Current Rating, Max Rating, Last Synced**.
* Options to:

  * ➕ Add new student
  * ✏️ Edit student details
  * 🗑️ Delete student
  * 📥 Download student list as CSV
  * 🔍 View detailed Codeforces profile

### ✅ Student Profile View

Split into two sections:

#### 📈 Contest History

* Filters: 30 / 90 / 365 days
* Graph of rating over time
* Table listing contests with:

  * Contest name
  * Rating change
  * Rank
  * Unsolved problems (still unsolved today)

#### 🧠 Problem Solving Stats

* Filters: 7 / 30 / 90 days
* Shows:

  * Most difficult problem solved
  * Total problems solved
  * Average problem rating
  * Problems solved per day (avg)
  * 📊 Bar chart of solved problems by rating bucket
  * 🔥 Submission heatmap

### 🔄 Codeforces Data Sync

* ⚙️ Automatically syncs every day at a configurable time (default: 2 AM)
* Admin can change sync **time** and **frequency** (daily, weekly, monthly)
* If a student's **Codeforces handle is updated**, data is re-fetched instantly
* Each student row shows when data was **last synced**

### 🔔 Inactivity Detection

* After every sync:

  * Detect students with **no submissions in last 7 days**
  * 🚨 Send automatic reminder email
  * Log email sent date, reason, and count per student
  * Admin can view **email logs** in a separate UI
  * Option to disable auto-email for specific students

### 🌗 UI & UX

* Responsive design for mobile and tablets 📱
* Theme toggle between **Light 🌞** and **Dark 🌙** mode
* User-friendly interface with toasts for feedback

---

## 🛠️ Tech Stack

| Layer                  | Tech                    |
| ---------------------- | ----------------------- |
| Frontend               | React.js, CSS, Chart.js |
| Backend                | Node.js, Express.js     |
| Database               | MongoDB                 |
| Authentication         | JWT                     |
| Codeforces Integration | Official CF APIs        |
| Email                  | Nodemailer              |
| Cron Jobs              | node-cron               |

---

## 📦 Folder Structure (Server)

```
├── controllers
│   └── codeforcesController.js
├── db
│   ├── student.js
│   ├── codeforcesData.js
│   └── syncConfig.js
├── routes
│   ├── studentRoutes.js
│   ├── syncRoutes.js
│   └── inactivityLogs.js
├── utils
│   └── sendReminderEmail.js
├── cron
│   └── startCodeforcesCron.js
├── server.js
```

---

## 🧪 API Endpoints (Protected via JWT)

### 🔹 Student APIs

* `GET /students?page=1&limit=6` - Paginated student list
* `POST /students` - Add student
* `PUT /students/:id` - Update student
* `DELETE /students/:id` - Delete student

### 🔹 Codeforces APIs

* `GET /sync/:studentId` - Manually trigger sync for student
* `POST /sync/config` - Update sync frequency/time
* `GET /sync/config` - Get current config

### 🔹 Inactivity APIs

* `GET /inactivity-logs` - Paginated logs of reminder emails sent

---

## 📷 Demo & Submission

* 🎥 **Video Demo:** [Link to video demo](https://your-demo-link.com)
* 🔗 **GitHub Repo:** [https://github.com/your-username/student-progress-system](https://github.com/your-username/student-progress-system)

> 💡 Tip: All interactions (add, sync, inactivity mail) are demonstrated in the demo video.

---

## 🧑‍💻 Developer Notes

* All API calls are handled via Axios.
* Realtime updates are handled via `window.location.reload()` (basic refresh strategy).
* Pagination and filtering handled client-side with backend support.
* Submission heatmap and bar graphs are created using Chart.js.

---

## 🛡️ Future Improvements

* Use WebSockets for live sync status
* Add login roles (admin, student)
* Notification system for users
* Export reports (PDF / Excel)

---

## 👤 Author

**Priyanka Kumari**
Final Year, DTU – Fullstack & ML Enthusiast
🔗 [LinkedIn](https://linkedin.com/in/priyanka-kumari) | 📧 [yadavpriyanka97181019@gmail.com](mailto:yadavpriyanka97181019@gmail.com)

---

> 🧩 Built with care to manage students, encourage practice, and track growth effectively.

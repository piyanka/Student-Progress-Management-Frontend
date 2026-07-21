# 📚 Student Progress Management System

A web application to manage, monitor, and analyze the competitive programming progress of students on Codeforces. Built with a modular and scalable architecture using the MERN stack.

---
![image](https://github.com/user-attachments/assets/d4b5ddce-e2ad-4a8a-9e68-dcd1342f7cc3)

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
|   └── inactivityLog.js
|   └── user.js
|   └── config.js
├── utils
│   └── sendReminderEmail.js
├── job
│   └── startCodeforcesCron.js
├── index.js
```
## 🧪 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-progress-manager.git
cd student-progress-manager
```

---

### 2. Setup Backend

```bash
cd server
npm install
nodemon install 
Add "start" : "nodemon index.js"
```

Create a `.env` file inside the `server/` directory with the following variables:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

Start the backend server:

```bash
npm start
```

---

### 3. Setup Frontend

```bash
cd ../client
npm install
npm start
```

The frontend will start on `http://localhost:3000` and connect to the backend at `http://localhost:5000` by default.

If you want to point the frontend at a different backend, create `Frontend/.env` with:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
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
* `POST /sync-config` - Update sync frequency/time
* `GET /sync-config` - Get current config
* `GET /health` - Check backend and API status

### 🔹 Inactivity APIs

* `GET /inactivity-logs` - Paginated logs of reminder emails sent


## 📷 Demo & Submission

* 🎥 **Video Demo:** [Link to video demo](https://drive.google.com/file/d/1h3RGIblLL_JYHK6r64cie35slZhMHOPN/view?usp=sharing)
* 🔗 **GitHub Repo:** [Link to repo](https://github.com/piyanka/Student-Progress-Management-Backend)

> 💡 Tip: All interactions (add, sync, inactivity mail) are demonstrated in the demo video.

---

## 🧑‍💻 Developer Notes

* All API calls are handled via Axios, Fetch.
* Realtime updates are handled via `window.location.reload()` (basic refresh strategy).
* Pagination and filtering handled client-side with backend support.
* Submission heatmap and bar graphs are created using Chart.js.

---


## 👤 Author

**Priyanka Kumari**
Final Year, DTU – Fullstack & ML Enthusiast
🔗 [LinkedIn]([https://linkedin.com/in/priyanka-yadav-3ab194243/]) | 📧 [yadavpriyanka97181019@gmail.com](mailto:yadavpriyanka97181019@gmail.com)

---

> 🧩 Built with care to manage students, encourage practice, and track growth effectively.

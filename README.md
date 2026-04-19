# Student Management System (CRUD)

A simple, modern Single-Page Application (SPA) for managing student records. This project provides a full CRUD (Create, Read, Update, Delete) interface with a sleek UI and a Python backend.

## Features

- **Dashboard:** View high-level statistics like Total Students, Departments, and Average CGPA.
- **Search & Filter:** Instantly filter students by their name/roll number/email or department.
- **Add Students:** Simple modal form to input complete student details.
- **Edit Students:** Easily update records if information changes.
- **Delete Students:** Remove student entries from the system permanently.
- **Responsive UI:** Clean, dark-mode inspired design with visual department color-coding and toast notifications.

## Technologies Used

- **Frontend:** Pure HTML, CSS (Custom Design System with Variables), and Vanilla JavaScript using `fetch` API.
- **Backend:** Python with `Flask`.
- **Database:** SQLite3 (`students.db`) for lightweight and zero-configuration data storage.

## How to Run Locally

### 1. Requirements

Make sure you have Python installed. The project relies on the Flask library.

```bash
# Install Flask if you don't have it
pip install flask
```

### 2. Start the Server

Run the Python backend script to start the server:

```bash
python app.py
```

### 3. Open the App in a Browser

Go to `http://127.0.0.1:5000` in your web browser. The backend will serve the student interface directly from its local path.

---
*Created by Mohan Ramasamy.*

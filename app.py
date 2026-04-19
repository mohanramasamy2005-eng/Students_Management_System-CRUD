import sqlite3
import json
from flask import Flask, request, jsonify, send_file
import os

app = Flask(__name__)
DB = 'students.db'

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            roll_no TEXT UNIQUE NOT NULL,
            department TEXT NOT NULL,
            year INTEGER NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            cgpa REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Seed some sample data
    try:
        conn.executemany('''
            INSERT INTO students (name, roll_no, department, year, email, phone, cgpa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', [
            ('Aravind Kumar', '21CS001', 'Computer Science', 3, 'aravind@college.edu', '9876543210', 8.7),
            ('Priya Sharma', '21EC002', 'Electronics', 2, 'priya@college.edu', '9876543211', 9.1),
            ('Rahul Verma', '21ME003', 'Mechanical', 4, 'rahul@college.edu', '9876543212', 7.5),
            ('Sneha Patel', '21CS004', 'Computer Science', 1, 'sneha@college.edu', '9876543213', 8.3),
        ])
        conn.commit()
    except:
        pass
    conn.close()

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/api/students', methods=['GET'])
def get_students():
    search = request.args.get('search', '')
    dept = request.args.get('department', '')
    conn = get_db()
    query = 'SELECT * FROM students WHERE 1=1'
    params = []
    if search:
        query += ' AND (name LIKE ? OR roll_no LIKE ? OR email LIKE ?)'
        params += [f'%{search}%', f'%{search}%', f'%{search}%']
    if dept:
        query += ' AND department = ?'
        params.append(dept)
    query += ' ORDER BY created_at DESC'
    students = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(s) for s in students])

@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    required = ['name', 'roll_no', 'department', 'year', 'email']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400
    try:
        conn = get_db()
        conn.execute('''
            INSERT INTO students (name, roll_no, department, year, email, phone, cgpa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data['name'], data['roll_no'], data['department'],
              data['year'], data['email'], data.get('phone', ''), data.get('cgpa', 0)))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student added successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Roll number already exists'}), 409

@app.route('/api/students/<int:sid>', methods=['GET'])
def get_student(sid):
    conn = get_db()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (sid,)).fetchone()
    conn.close()
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(dict(student))

@app.route('/api/students/<int:sid>', methods=['PUT'])
def update_student(sid):
    data = request.json
    conn = get_db()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (sid,)).fetchone()
    if not student:
        conn.close()
        return jsonify({'error': 'Student not found'}), 404
    try:
        conn.execute('''
            UPDATE students SET name=?, roll_no=?, department=?, year=?, email=?, phone=?, cgpa=?
            WHERE id=?
        ''', (data['name'], data['roll_no'], data['department'],
              data['year'], data['email'], data.get('phone', ''), data.get('cgpa', 0), sid))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student updated successfully'})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Roll number already exists'}), 409

@app.route('/api/students/<int:sid>', methods=['DELETE'])
def delete_student(sid):
    conn = get_db()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (sid,)).fetchone()
    if not student:
        conn.close()
        return jsonify({'error': 'Student not found'}), 404
    conn.execute('DELETE FROM students WHERE id = ?', (sid,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Student deleted successfully'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    total = conn.execute('SELECT COUNT(*) as c FROM students').fetchone()['c']
    depts = conn.execute('SELECT COUNT(DISTINCT department) as c FROM students').fetchone()['c']
    avg_cgpa = conn.execute('SELECT AVG(cgpa) as a FROM students').fetchone()['a']
    conn.close()
    return jsonify({
        'total': total,
        'departments': depts,
        'avg_cgpa': round(avg_cgpa or 0, 2)
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)

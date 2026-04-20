let deleteTargetId = null;

// Initialize data in local storage
if (!localStorage.getItem('students')) {
  const initialData = [
    { id: 1, name: 'Aravind Kumar', roll_no: '21CS001', department: 'Computer Science', year: 3, email: 'aravind@college.edu', phone: '9876543210', cgpa: 8.7, created_at: new Date().toISOString() },
    { id: 2, name: 'Priya Sharma', roll_no: '21EC002', department: 'Electronics', year: 2, email: 'priya@college.edu', phone: '9876543211', cgpa: 9.1, created_at: new Date().toISOString() },
    { id: 3, name: 'Rahul Verma', roll_no: '21ME003', department: 'Mechanical', year: 4, email: 'rahul@college.edu', phone: '9876543212', cgpa: 7.5, created_at: new Date().toISOString() },
    { id: 4, name: 'Sneha Patel', roll_no: '21CS004', department: 'Computer Science', year: 1, email: 'sneha@college.edu', phone: '9876543213', cgpa: 8.3, created_at: new Date().toISOString() }
  ];
  localStorage.setItem('students', JSON.stringify(initialData));
}

function getStudents() {
  return JSON.parse(localStorage.getItem('students')) || [];
}

function saveStudents(data) {
  localStorage.setItem('students', JSON.stringify(data));
}

function getDeptClass(dept) {
  const map = { 'Computer Science': 'dept-cs', 'Electronics': 'dept-ec', 'Mechanical': 'dept-me', 'Civil': 'dept-ce', 'Information Technology': 'dept-cs', 'Electrical': 'dept-ec' };
  return map[dept] || 'dept-other';
}

function getCgpaClass(cgpa) {
  if (cgpa >= 8.5) return 'cgpa-high';
  if (cgpa >= 6.5) return 'cgpa-mid';
  return 'cgpa-low';
}

function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function loadStats() {
  const students = getStudents();
  const depts = new Set(students.map(s => s.department)).size;
  const avgCgpa = students.length ? students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length : 0;
  
  document.getElementById('statTotal').textContent = students.length;
  document.getElementById('statDepts').textContent = depts;
  document.getElementById('statCgpa').textContent = avgCgpa > 0 ? avgCgpa.toFixed(2) : '—';
}

function loadStudents() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;
  
  let students = getStudents();
  
  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search) || 
                          s.roll_no.toLowerCase().includes(search) || 
                          s.email.toLowerCase().includes(search);
    const matchesDept = dept === '' || s.department === dept;
    return matchesSearch && matchesDept;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const tbody = document.getElementById('studentTable');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>No students found</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = filtered.map((s, i) => `
    <tr>
      <td style="color:var(--muted);font-family:var(--mono);font-size:12px;">${String(i+1).padStart(2,'0')}</td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:50%;background:rgba(200,241,53,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--accent);flex-shrink:0;">${initials(s.name)}</div>
          <div>
            <div style="font-weight:500;font-size:13px;">${s.name}</div>
            <div style="font-size:11px;color:var(--muted);">${s.email}</div>
          </div>
        </div>
      </td>
      <td><span class="roll-badge">${s.roll_no}</span></td>
      <td><span class="dept-badge ${getDeptClass(s.department)}">${s.department}</span></td>
      <td><span class="year-dot">${s.year}</span></td>
      <td><span class="cgpa-val ${getCgpaClass(s.cgpa)}">${s.cgpa ? parseFloat(s.cgpa).toFixed(1) : '—'}</span></td>
      <td style="color:var(--muted);font-size:12px;">${s.phone || '—'}</td>
      <td>
        <div class="actions">
          <button class="btn btn-ghost btn-sm" onclick="openEditModal(${s.id})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${s.id}, '${s.name.replace(/'/g, "\\'")}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Student';
  document.getElementById('editId').value = '';
  ['name','roll','year','dept','email','phone','cgpa'].forEach(f => {
    const el = document.getElementById('f_' + f);
    if (el) el.value = f === 'year' ? '1' : (f === 'dept' ? 'Computer Science' : '');
  });
  document.getElementById('formOverlay').classList.add('active');
}

function openEditModal(id) {
  const s = getStudents().find(x => x.id === id);
  if (!s) return;
  document.getElementById('modalTitle').textContent = 'Edit Student';
  document.getElementById('editId').value = s.id;
  document.getElementById('f_name').value = s.name;
  document.getElementById('f_roll').value = s.roll_no;
  document.getElementById('f_year').value = s.year;
  document.getElementById('f_dept').value = s.department;
  document.getElementById('f_email').value = s.email;
  document.getElementById('f_phone').value = s.phone || '';
  document.getElementById('f_cgpa').value = s.cgpa || '';
  document.getElementById('formOverlay').classList.add('active');
}

function submitForm() {
  const name = document.getElementById('f_name').value.trim();
  const roll = document.getElementById('f_roll').value.trim();
  const dept = document.getElementById('f_dept').value;
  const year = parseInt(document.getElementById('f_year').value);
  const email = document.getElementById('f_email').value.trim();
  const phone = document.getElementById('f_phone').value.trim();
  const cgpa = parseFloat(document.getElementById('f_cgpa').value) || 0;
  
  if (!name || !roll || !dept || !year || !email) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const id = document.getElementById('editId').value;
  let students = getStudents();

  if (id) {
    const existingIndex = students.findIndex(x => x.id === parseInt(id));
    if (existingIndex > -1) {
      if (students.some(x => x.roll_no === roll && x.id !== parseInt(id))) {
        showToast('Roll number already exists', 'error');
        return;
      }
      students[existingIndex] = { ...students[existingIndex], name, roll_no: roll, department: dept, year, email, phone, cgpa };
      saveStudents(students);
      showToast('Student updated successfully', 'success');
    }
  } else {
    if (students.some(x => x.roll_no === roll)) {
      showToast('Roll number already exists', 'error');
      return;
    }
    const newId = students.length > 0 ? Math.max(...students.map(x => x.id)) + 1 : 1;
    students.push({ id: newId, name, roll_no: roll, department: dept, year, email, phone, cgpa, created_at: new Date().toISOString() });
    saveStudents(students);
    showToast('Student added successfully', 'success');
  }

  closeModal('formOverlay');
  loadStudents();
  loadStats();
}

function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteNameLabel').textContent = name;
  document.getElementById('deleteOverlay').classList.add('active');
}

function confirmDelete() {
  let students = getStudents();
  const originalLength = students.length;
  students = students.filter(s => s.id !== deleteTargetId);
  saveStudents(students);
  closeModal('deleteOverlay');
  if (students.length < originalLength) {
    showToast('Student deleted successfully', 'success');
    loadStudents();
    loadStats();
  } else {
    showToast('Student not found', 'error');
  }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function closeOnBackdrop(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

function showToast(msg, type='success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${type === 'success' ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}</svg> ${msg}`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

loadStats();
loadStudents();

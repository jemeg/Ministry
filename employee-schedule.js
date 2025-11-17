import { getUsers, getScheduleData, getAllImages, recordCheckInSupabase, recordCheckOutSupabase } from './database.js';


let currentEmployee = null;


document.addEventListener('DOMContentLoaded', async () => {
try {
const emp = sessionStorage.getItem('employeeData');
if (!emp) { window.location.href = 'login.html'; return; }
currentEmployee = JSON.parse(emp);
document.getElementById('employeeName').textContent = currentEmployee.name || '';


// جلب الجداول و الصور
await loadScheduleData();
await loadParamedicsTable();
await loadImages();


document.getElementById('logoutBtn').addEventListener('click', ()=>{
sessionStorage.removeItem('employeeData');
window.location.href = 'login.html';
});
} catch(e){ console.error(e); }
});


async function loadScheduleData(){
const data = await getScheduleData();
// فلترة حسب اسم و رتبة المستخدم (كما في ملفك الأصلي)
const my = data.filter(r => r.name && r.name.trim().toLowerCase() === (currentEmployee.name||'').trim().toLowerCase() && r.rank && r.rank.trim().toLowerCase() === (currentEmployee.rank||'').trim().toLowerCase());
// عرض
const tbody = document.getElementById('scheduleTableBody');
tbody.innerHTML = my.map(row => `
<tr>
<td>${new Date(row.date).toLocaleDateString('ar-SA')}</td>
<td>${new Date(row.date).toLocaleDateString('ar-SA', { weekday: 'long' })}</td>
<td>${row.rank||''}</td>
<td>${row.shift||''}</td>
<td>${row.active? 'مفعل' : 'غير مفعل'}</td>
<td>-</td>
</tr>
`).join('');
}


async function loadParamedicsTable(){
const users = await getUsers();
const tbody = document.getElementById('paramedicTableBody');
tbody.innerHTML = users.map(u => `
<tr>
<td>${u.name}</td>
<td>${u.code}</td>
<td>${u.age||'-'}</td>
<td id="in-${u.id}"><button class="btn btn-success btn-sm" onclick="checkIn('${u.id}')">تسجيل الدخول</button></td>
<td id="out-${u.id}"><button class="btn btn-danger btn-sm" onclick="checkOut('${u.id}')">تسجيل الخروج</button></td>
<td id="hours-${u.id}">-</td>
</tr>
`).join('');
}


window.checkIn = async function(userId){
// فقط السماح للمستخدمين الذين يملكون نفس id أو المسؤول (future)
if (!currentEmployee) { alert('يجب تسجيل الدخول'); return; }
if (currentEmployee.id !== userId && !currentEmployee.is_admin) { alert('لا يمكنك تسجيل هذا المستخدم'); return; }
await recordCheckInSupabase(userId);
alert('تم تسجيل الدخول في Supabase');
await loadParamedicsTable();
};


window.checkOut = async function(userId){
if (!currentEmployee) { alert('يجب تسجيل الدخول'); return; }
if (currentEmployee.id !== userId && !currentEmployee.is_admin) { alert('لا يمكنك تسجيل هذا المستخدم'); return; }
await recordCheckOutSupabase(userId);
alert('تم تسجيل الخروج وحساب الساعات');
await loadParamedicsTable();
};


async function loadImages(){
const imgs = await getAllImages();
const grid = document.querySelector('.image-grid');
grid.innerHTML = imgs.map(i=>`<div class="image-card"><img src="${i.path}" alt="${i.title}"/><div class="image-overlay"><span>${i.title}</span></div></div>`).join('');
}
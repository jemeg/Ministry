// database.js (module)
import { supabase } from './main.js';


// جلب جميع المستخدمين النشطين
export async function getUsers() {
const { data, error } = await supabase
.from('users')
.select('*')
.eq('active', true)
.order('name');
if (error) { console.error(error); return []; }
return data;
}


// التحقق من ID + code (يستخدم في صفحة الدخول)
export async function verifyUser(id, code) {
const { data, error } = await supabase
.from('users')
.select('*')
.eq('id', id)
.eq('code', code)
.eq('active', true);
if (error) { console.error(error); return null; }
return data;
}


// تسجيل الدخول — إدخال سجل دخول في work_hours
export async function recordCheckInSupabase(user_id) {
const { data, error } = await supabase
.from('work_hours')
.insert({ user_id: user_id, check_in: new Date().toISOString() });
if (error) { console.error(error); return null; }
return data;
}


// تسجيل الخروج — تحديث آخر سجل check_out و حساب total_hours
export async function recordCheckOutSupabase(user_id) {
// نبحث عن آخر سجل بدون check_out
const { data: rows, error: selectErr } = await supabase
.from('work_hours')
.select('*')
.eq('user_id', user_id)
.is('check_out', null)
.order('check_in', { ascending: false })
.limit(1);
if (selectErr) { console.error(selectErr); return null; }
if (!rows || rows.length === 0) return null;
const row = rows[0];
const checkIn = new Date(row.check_in);
const checkOut = new Date();
const diffHrs = ((checkOut - checkIn) / (1000 * 60 * 60));
const { data, error } = await supabase
.from('work_hours')
.update({ check_out: checkOut.toISOString(), total_hours: diffHrs })
.eq('id', row.id);
if (error) { console.error(error); return null; }
return data;
}


export async function getAllImages() {
const { data, error } = await supabase
.from('images')
.select('*')
.order('created_at', { ascending: false });
if (error) { console.error(error); return []; }
return data;
}


export async function getScheduleData() {
const { data, error } = await supabase
.from('schedule')
.select('*')
.order('date', { ascending: true });
if (error) { console.error(error); return []; }
return data;
}
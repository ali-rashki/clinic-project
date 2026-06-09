# مستند کامل API پروژه نوبت‌دهی پزشکی

## 🔐 احراز هویت

### ثبت‌نام کاربر جدید
- **آدرس:** `POST /api/auth/register/`
- **نیاز به توکن:** ❌ خیر

**بدنه درخواست:**
{"username": "ahmad_123", "password": "StrongPass@1403", "password2": "StrongPass@1403", "email": "ahmad@example.com", "first_name": "احمد", "last_name": "رضایی", "phone": "09123456789", "role": "patient"}

**پاسخ موفق:**
{"message": "ثبت‌نام با موفقیت انجام شد.", "user": {"id": 1, "username": "ahmad_123", "full_name": "احمد رضایی", "phone": "09123456789", "role": "patient", "role_display": "بیمار"}, "tokens": {"access": "eyJhbGc...", "refresh": "eyJhbGc..."}}

---

### ورود به سیستم
- **آدرس:** `POST /api/auth/login/`
- **نیاز به توکن:** ❌ خیر

**بدنه درخواست:**
{"username": "ahmad_123", "password": "StrongPass@1403"}

**پاسخ موفق:**
{"refresh": "eyJhbGc...", "access": "eyJhbGc..."}

---

### دریافت پروفایل کاربر
- **آدرس:** `GET /api/auth/profile/`
- **نیاز به توکن:** ✅ بله
- **Header:** `Authorization: Bearer <access_token>`

**پاسخ موفق:**
{"id": 1, "username": "ahmad_123", "full_name": "احمد رضایی", "phone": "09123456789", "role": "patient", "role_display": "بیمار", "profile_picture": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", "is_verified": false}

---

## 🏥 تخصص‌ها و پزشکان

### لیست تخصص‌ها
- **آدرس:** `GET /api/specialties/`
- **نیاز به توکن:** ❌ خیر

**پاسخ موفق:**
[{"id": 1, "name": "قلب و عروق", "description": "بیماری‌های قلبی و عروقی"}]

---

### لیست پزشکان
- **آدرس:** `GET /api/specialties/doctors/`
- **نیاز به توکن:** ❌ خیر

**پاسخ موفق:**
[{"id": 1, "user_full_name": "دکتر علی احمدی", "specialty_name": "قلب و عروق", "consultation_fee": "150000.00", "gender": "male", "visit_type": "both", "experience_years": 10, "is_approved": true}]

---

## 🏢 کلینیک‌ها

### لیست کلینیک‌ها
- **آدرس:** `GET /api/clinics/`
- **نیاز به توکن:** ❌ خیر

**پاسخ موفق:**
[{"id": 1, "name": "کلینیک قلب تهران", "city": "تهران", "phone": "021-12345678", "is_active": true}]

---

## 📅 نوبت‌ها

### رزرو نوبت جدید
- **آدرس:** `POST /api/appointments/create/`
- **نیاز به توکن:** ✅ بله (فقط بیمار)
- **Header:** `Authorization: Bearer <access_token>`

**بدنه درخواست:**
{"doctor": 1, "appointment_date": "2026-06-20", "appointment_time": "10:00:00", "symptoms": "سردرد شدید"}

**پاسخ موفق:**
{"id": 1, "status": "pending", "status_display": "در انتظار تایید پزشک", "appointment_date": "2026-06-20", "appointment_time": "10:00:00", "symptoms": "سردرد شدید"}

---

### مشاهده نوبت‌های من (بیمار)
- **آدرس:** `GET /api/appointments/my/`
- **نیاز به توکن:** ✅ بله
- **Header:** `Authorization: Bearer <access_token>`

**پاسخ موفق:**
[{"id": 1, "appointment_date": "2026-06-20", "appointment_time": "10:00:00", "status": "pending", "status_display": "در انتظار تایید پزشک", "doctor_name": "دکتر علی احمدی"}]

---

### مشاهده نوبت‌های پزشک
- **آدرس:** `GET /api/appointments/doctor/`
- **نیاز به توکن:** ✅ بله (فقط پزشک)
- **Header:** `Authorization: Bearer <access_token>`

**پاسخ موفق:**
[{"id": 1, "patient_name": "احمد رضایی", "appointment_date": "2026-06-20", "appointment_time": "10:00:00", "status": "pending", "status_display": "در انتظار تایید پزشک", "symptoms": "سردرد شدید"}]

---

### دریافت ساعات کاری پزشک
- **آدرس:** `GET /api/appointments/availability/<doctor_id>/`
- **نیاز به توکن:** ❌ خیر

**پاسخ موفق:**
[{"day_display": "شنبه", "start_time": "09:00:00", "end_time": "13:00:00", "slot_duration": 30}]

---

## ⭐ نظرات

### ثبت نظر برای پزشک
- **آدرس:** `POST /api/reviews/create/`
- **نیاز به توکن:** ✅ بله (فقط بیمار)
- **Header:** `Authorization: Bearer <access_token>`

**بدنه درخواست:**
{"doctor": 1, "rating": 5, "comment": "دکتر بسیار خوب و حرفه‌ای بودند."}

**پاسخ موفق:**
{"id": 1, "rating": 5, "comment": "دکتر بسیار خوب و حرفه‌ای بودند.", "created_at": "2026-06-04T20:30:00Z"}

---

## 🎫 تیکت‌های پشتیبانی

### ایجاد تیکت جدید
- **آدرس:** `POST /api/tickets/create/`
- **نیاز به توکن:** ✅ بله
- **Header:** `Authorization: Bearer <access_token>`

**بدنه درخواست:**
{"subject": "مشکل در رزرو نوبت", "message": "من نمی‌توانم نوبت رزرو کنم."}

**پاسخ موفق:**
{"id": 1, "subject": "مشکل در رزرو نوبت", "message": "من نمی‌توانم نوبت رزرو کنم.", "status": "open", "created_at": "2026-06-04T20:30:00Z"}

---

## 📊 جدول خلاصه

| آدرس | متد | نیاز به توکن |
|------|------|-------------|
| /api/auth/register/ | POST | ❌ |
| /api/auth/login/ | POST | ❌ |
| /api/auth/profile/ | GET | ✅ |
| /api/specialties/ | GET | ❌ |
| /api/specialties/doctors/ | GET | ❌ |
| /api/clinics/ | GET | ❌ |
| /api/appointments/create/ | POST | ✅ |
| /api/appointments/my/ | GET | ✅ |
| /api/appointments/doctor/ | GET | ✅ |
| /api/appointments/availability/<id>/ | GET | ❌ |
| /api/reviews/create/ | POST | ✅ |
| /api/tickets/create/ | POST | ✅ |

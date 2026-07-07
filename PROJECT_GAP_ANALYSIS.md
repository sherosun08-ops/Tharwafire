# 📋 وثيقة تحليل الفجوات - مشروع ثروة كابيتال (Tharwafire)

**تاريخ التحليل:** 7 يوليو 2026  
**المستودع:** sherosun08-ops/Tharwafire  
**الهدف:** تحديد المشاكل والنواقص ليصبح المشروع إنتاجي ومكتمل 100%

---

## 📊 ملخص تنفيذي

| الفئة | الحالة |
|-------|--------|
| الواجهة الأمامية (Frontend) | ⚠️ مكتملة بصريًا لكن تعتمد على بيانات وهمية |
| واجهة الإدارة (Admin Panel) | ⚠️ مكتملة جزئيًا - بعض الصفحات وهمية |
| واجهة العميل (Client Dashboard) | ⚠️ مكتملة جزئيًا |
| الباك-إند (API) | ✅ موجود لكن ناقص endpoints |
| قاعدة البيانات | ✅ موجودة لكن ناقصة جداول |
| الأمان | ❌ ثغرات خطيرة |
| الخدمات الخارجية | ❌ غير مفعلة |

---

## 🔴 أولاً: مشاكل التصميم والواجهات

### 1.1 مشاكل الواجهة الأمامية للموقع العام

| المكون | المشكلة | الخطورة |
|--------|---------|---------|
| `LiveTicker.tsx` | أسعار الأسواق ثابتة وهمية - غير متصلة بـ API حقيقي | 🔴 عالية |
| `MarketsPreview.tsx` | يعرض بيانات ثابتة وليس حية من API | 🟡 متوسطة |
| `Testimonials.tsx` | يقرأ من site_settings لكن يمكن تحسين عرضه | 🟢 منخفضة |
| `SiteHeader.tsx` | روابط التنقل تعمل لكن يمكن إضافة مفتاح تبديل اللغة | 🟡 متوسطة |
| `SiteFooter.tsx` | الروابط الاجتماعية وهمية - تحتاج روابط حقيقية | 🟡 متوسطة |

### 1.2 مشاكل واجهة لوحة الإدارة

#### صفحة `Security.tsx` - ❌ كاملة البيانات وهمية

```tsx
// المشاكل المحددة:
- تبويب "سجلات النشاط": يستخدم mockLogs من adminData.ts
  → المطلوب: استدعاء getAuditLogs() → GET /api/v1/audit-logs

- تبويب "الجلسات النشطة": مصفوفة sessions[] مكتوبة يدويًا داخل الملف
  → المطلوب: إنشاء جدول sessions في قاعدة البيانات + endpoint

- تبويب "التهديدات": مصفوفة threats[] مكتوبة يدويًا
  → المطلوب: مصدر حقيقي أو إزالة هذا التبويب

- إعدادات الأمان (toggles): toggleItem() يغير local state فقط
  → المطلوب: حفظ الإعدادات عبر saveSettings API
```

#### صفحة `Reports.tsx` - ❌ رسوم بيانية وهمية

```tsx
// المشاكل المحددة:
- رسم Revenue: يستخدم chartRevenue من adminData.ts
- رسم AUM: يستخدم chartAUM من adminData.ts  
- رسم New Clients: يستخدم chartNewClients من adminData.ts
- KPIs (+18.3%, $94K...): أرقام ثابتة hardcoded
- أفضل العملاء: مصفوفة hardcoded
- أداء المستشارين: مصفوفة hardcoded
- فلاتر الفترة: لا تؤثر على البيانات
- زر "تصدير PDF": بلا handler

// المطلوب:
GET /api/v1/reports?period=month
→ حساب KPIs حقيقية من قاعدة البيانات
```

#### صفحة `Team.tsx` - ⚠️ قائمة الأعضاء وهمية

```tsx
// المشاكل:
- قائمة الأعضاء: تقرأ من mockTeam في adminData.ts
- إحصائيات الأدوار: تُحسب من mockTeam

// المطلوب:
useEffect(() => { getSubAdmins(); }, []);
```

#### صفحة `Messages.tsx` - ⚠️ تبويب المراسلات المباشرة وهمي

```tsx
// المشاكل:
- قائمة المحادثات: mockMessages
- إرسال رد: sendMsg() تعيد setInput('') فقط
- عداد الرسائل غير المقروءة: يعتمد على mockMessages

// تبويب "رسائل التواصل" يعمل ✅
```

#### صفحة `Overview.tsx` - ⚠️ رسوم بيانية وهمية

```tsx
// المشاكل:
- رسم AUM: uses chartAUM من adminData.ts
- رسم Revenue: uses chartRevenue من adminData.ts
- الإجراءات السريعة: أزرار ديكورية بلا وظيفة

// KPIs الرئيسية من getOverview() تعمل ✅
```

#### صفحة `Notifications.tsx` - ⚠️ الحذف غير مستمر

```tsx
// المشاكل:
- حذف إشعار: setNotifs(filter...) فقط - لا API call
- تعليم الكل مقروء: local state فقط
- قواعد الإشعارات: مصفوفة ثابتة

// التحميل وتعليم الواحدة مقروءة يعمل ✅
```

---

## 🔴 ثانياً: الواجهات الناقصة بالكامل

### 2.1 واجهة العميل (Client Dashboard) - النواقص

| الصفحة | الحالة | المطلوب |
|--------|--------|---------|
| لوحة التحكم الرئيسية | ⚠️ موجودة لكن بيانات وهمية | ربط بـ API حقيقي |
| صفحة المحفظة | ⚠️ موجودة لكن أسعار ثابتة | ربط بـ APIs الأسعار الحية |
| سجل المعاملات | ⚠️ موجود لكن محدود | فلترة متقدمة + تصدير |
| صفحة الملف الشخصي | ⚠️ موجودة | إمكانية التعديل |
| **صفحة الإشعارات** | ❌ ناقصة بالكامل | إنشاء صفحة جديدة |
| **صفحة الدعم الفني** | ❌ ناقصة بالكامل | نموذج تواصل + تذاكر |
| **صفحة التقارير** | ❌ ناقصة بالكامل | تقارير شهرية PDF |
| **صفحة KYC** | ❌ ناقصة بالكامل | رفع الوثائق + حالة التحقق |
| **صفحة الإعدادات** | ❌ ناقصة بالكامل | تغيير كلمة المرور، الإشعارات |

### 2.2 واجهة الإدارة (Admin Panel) - النواقص

| الصفحة | الحالة | المطلوب |
|--------|--------|---------|
| لوحة التحكم (Overview) | ⚠️ جزئي | رسوم بيانية حقيقية |
| إدارة العملاء | ✅ تعمل | - |
| إدارة المحافظ | ✅ تعمل | أسعار حية |
| إدارة المعاملات | ✅ تعمل | - |
| المحتوى (CMS) | ✅ يعمل | - |
| الإعدادات | ✅ تعمل | - |
| **صفحة التقارير المتقدمة** | ❌ وهمية | تحليلات حقيقية + تصدير |
| **صفحة إدارة المقالات** | ⚠️ جزئي | محرر WYSIWYG |
| **صفحة النشرة البريدية** | ❌ ناقصة | إرسال بريد جماعي |
| **صفحة سجل التدقيق** | ❌ ناقصة | عرض logs من API |
| **صفحة الإعدادات الأمنية** | ❌ وهمية | حفظ حقيقي |
| **صفحة التكاملات** | ❌ ناقصة | إعدادات الخدمات الخارجية |

---

## 🟡 ثالثاً: أقسام ناقصة في قاعدة البيانات

### الجداول الموجودة في `supabase/schema.sql`:

✅ `admins`  
✅ `sub_admins`  
✅ `clients`  
✅ `portfolios`  
✅ `transactions`  
✅ `contact_messages`  
✅ `site_settings`  
✅ `articles`  
✅ `notifications`  
✅ `audit_logs`  

### الجداول الناقصة:

```sql
-- ❌ ناقص: جدول جلسات المشرفين
CREATE TABLE admin_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES admins(id),
  token_hash  TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول جلسات العملاء
CREATE TABLE client_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID REFERENCES clients(id),
  token_hash  TEXT NOT NULL,
  ip_address  TEXT,
  user_agent  TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول وثائق KYC
CREATE TABLE kyc_documents (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID REFERENCES clients(id),
  doc_type     TEXT NOT NULL, -- national_id, passport, utility_bill
  doc_url      TEXT NOT NULL,
  status       TEXT DEFAULT 'pending', -- pending, approved, rejected
  uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ,
  reviewed_by  UUID REFERENCES admins(id),
  notes        TEXT
);

-- ❌ ناقص: جدول تذاكر الدعم
CREATE TABLE support_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID REFERENCES clients(id),
  subject     TEXT NOT NULL,
  status      TEXT DEFAULT 'open', -- open, in_progress, closed
  priority    TEXT DEFAULT 'normal', -- low, normal, high, urgent
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ,
  closed_at   TIMESTAMPTZ,
  assigned_to UUID REFERENCES admins(id)
);

-- ❌ ناقص: جدول ردود التذاكر
CREATE TABLE ticket_replies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   UUID REFERENCES support_tickets(id),
  sender_type TEXT NOT NULL, -- client, admin
  sender_id   UUID NOT NULL,
  message     TEXT NOT NULL,
  attachment  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول المشتركين في النشرة
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  subscribed  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول سجل تسعير الأصول
CREATE TABLE asset_price_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol      TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  currency    TEXT DEFAULT 'USD',
  source      TEXT, -- twelvedata, manual
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول إعدادات التكاملات
CREATE TABLE integrations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  service     TEXT NOT NULL, -- resend, twelvedata, twilio
  config      JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ
);

-- ❌ ناقص: جدول القوالب البريدية
CREATE TABLE email_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  subject_ar  TEXT,
  subject_en  TEXT,
  body_ar     TEXT,
  body_en     TEXT,
  variables   JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ❌ ناقص: جدول محاولات تسجيل الدخول
CREATE TABLE login_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  ip_address  TEXT,
  success      BOOLEAN NOT NULL,
  user_type   TEXT, -- admin, sub_admin, client
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🟡 رابعاً: نقاط نهاية API الناقصة

### الموجودة في `api/index.js`:

✅ `GET/POST /api/v1/health`  
✅ `POST /api/v1/auth/admin-login`  
✅ `POST /api/v1/auth/client-login`  
✅ `GET/POST/PATCH/DELETE /api/v1/clients`  
✅ `GET/POST/PATCH/DELETE /api/v1/transactions`  
✅ `GET/POST/PATCH/DELETE /api/v1/portfolios`  
✅ `GET/POST /api/v1/settings`  
✅ `GET/POST/PATCH/DELETE /api/v1/messages`  
✅ `GET/POST/PATCH/DELETE /api/v1/sub-admins`  
✅ `GET/PATCH /api/v1/notifications`  
✅ `GET /api/v1/overview`  
✅ `GET /api/v1/client/profile`  
✅ `GET /api/v1/client/portfolio`  
✅ `GET /api/v1/client/transactions`  
✅ `GET /api/v1/auth/verify`  
✅ `GET/POST/PATCH/DELETE /api/v1/articles`  
✅ `GET/POST/PATCH/DELETE /api/v1/faqs`  
✅ `GET/POST/PATCH/DELETE /api/v1/services`  
✅ `GET/POST/PATCH/DELETE /api/v1/testimonials`  
✅ `GET /api/v1/audit-logs`  

### الناقصة:

```javascript
// ❌ المصادقة
POST   /api/v1/auth/admin/logout          // تسجيل خروج المشرف
POST   /api/v1/auth/client/logout         // تسجيل خروج العميل
POST   /api/v1/auth/forgot-password       // نسيت كلمة المرور
POST   /api/v1/auth/reset-password        // إعادة تعيين كلمة المرور
POST   /api/v1/auth/change-password      // تغيير كلمة المرور
POST   /api/v1/auth/verify-2fa           // التحقق بخطوتين

// ❌ الجلسات
GET    /api/v1/admin/sessions            // قائمة الجلسات النشطة
DELETE /api/v1/admin/sessions/:id        // إنهاء جلسة

// ❌ تذاكر الدعم
GET    /api/v1/tickets                   // قائمة التذاكر (للمشرف)
POST   /api/v1/tickets                   // إنشاء تذكرة (للعميل)
GET    /api/v1/tickets/:id               // تفاصيل تذكرة
POST   /api/v1/tickets/:id/reply         // رد على تذكرة
PATCH  /api/v1/tickets/:id/status        // تغيير حالة التذكرة

// ❌ وثائق KYC
GET    /api/v1/kyc/:clientId             // وثائق عميل
POST   /api/v1/kyc/:clientId             // رفع وثيقة
PATCH  /api/v1/kyc/:documentId/status    // الموافقة/الرفض

// ❌ النشرة البريدية
GET    /api/v1/newsletter/subscribers    // قائمة المشتركين
POST   /api/v1/newsletter/subscribe      // اشتراك جديد
POST   /api/v1/newsletter/unsubscribe    // إلغاء اشتراك
POST   /api/v1/newsletter/send           // إرسال نشرة

// ❌ التقارير
GET    /api/v1/reports/overview          // ملخص شامل
GET    /api/v1/reports/aum-chart         // بيانات رسم AUM
GET    /api/v1/reports/revenue-chart     // بيانات رسم Revenue
GET    /api/v1/reports/clients-growth    // نمو العملاء
GET    /api/v1/reports/export/pdf        // تصدير PDF
GET    /api/v1/reports/export/excel      // تصدير Excel

// ❌ أسعار السوق
GET    /api/v1/market/prices             // أسعار حية
GET    /api/v1/market/ticker             // شريط الأسعار
POST   /api/v1/market/refresh            // تحديث الأسعار

// ❌ إدارة الملفات
POST   /api/v1/upload/image             // رفع صورة
POST   /api/v1/upload/document          // رفع مستند
DELETE /api/v1/upload/:fileId           // حذف ملف

// ❌ الإشعارات المتقدمة
GET    /api/v1/notifications/settings   // إعدادات الإشعارات
POST   /api/v1/notifications/settings   // تحديث الإعدادات
POST   /api/v1/notifications/test       // إرسال إشعار تجريبي

// ❌ التكاملات
GET    /api/v1/integrations              // قائمة التكاملات
PATCH  /api/v1/integrations/:id          // تحديث تكامل
POST   /api/v1/integrations/:id/test     // اختبار تكامل
```

---

## 🔴 خامساً: ثغرات أمنية حرجة

| الثغرة | الخطورة | الملف | الحل |
|--------|---------|-------|------|
| CORS مفتوح | 🔴 عالية | `api/index.js:13` | تعيين `ALLOWED_ORIGIN` في Vercel |
| JWT في localStorage | 🔴 عالية | `src/lib/auth.ts` | استخدام httpOnly cookies |
| لا rate limiting | 🔴 عالية | Backend | إضافة Upstash Redis + rate limiter |
| صلاحيات غير محققة | 🟡 متوسطة | Backend | فحص permissions[] في كل endpoint |
| كلمات مرور ضعيفة | 🟡 متوسطة | Frontend | سياسة كلمات مرور قوية |
| لا 2FA | 🟡 متوسطة | - | إضافة تحقق بخطوتين |
| Sessions غير محفوظة | 🟡 متوسطة | - | إنشاء جدول sessions |

---

## 🟡 سادساً: الخدمات الخارجية غير المفعلة

| الخدمة | الحالة | المطلوب |
|--------|--------|---------|
| **Resend (البريد)** | ❌ غير مفعّل | إعداد حساب + قوالب بريد |
| **TwelveData (الأسواق)** | ❌ غير مفعّل | API key + تحديث الأسعار |
| **Twilio/WhatsApp** | ❌ غير مفعّل | إشعارات SMS/WhatsApp |
| **Supabase Storage** | ⚠️ غير مستخدم | رفع وثائق KYC + صور |
| **تحديث الأسعار التلقائي** | ❌ غير موجود | Cron job لتحديث الأسعار |

---

## 🟢 سابعاً: قائمة المراجعة للإنتاج

### ✅ المكتمل

- [x] تصميم الواجهة الأمامية
- [x] تصميم لوحة الإدارة
- [x] API أساسي للمصادقة
- [x] CRUD للعملاء
- [x] CRUD للمعاملات
- [x] CRUD للمحافظ
- [x] CMS للإعدادات
- [x] جدول audit_logs

### ⚠️ المطلوب إصلاحه

- [ ] Security.tsx - ربط بـ API
- [ ] Reports.tsx - بيانات حقيقية
- [ ] Team.tsx - ربط بـ API
- [ ] Messages.tsx - تبويب المراسلات
- [ ] Overview.tsx - رسوم بيانية
- [ ] Notifications.tsx - حفظ الإعدادات

### ❌ المطلوب إنشاؤه

#### واجهة العميل
- [ ] صفحة الإشعارات
- [ ] صفحة الدعم والتذاكر
- [ ] صفحة التقارير الشهرية
- [ ] صفحة KYC
- [ ] صفحة الإعدادات

#### واجهة الإدارة
- [ ] صفحة التقارير المتقدمة
- [ ] صفحة سجل التدقيق (واجهة)
- [ ] صفحة النشرة البريدية
- [ ] صفحة التكاملات

#### قاعدة البيانات
- [ ] جدول sessions
- [ ] جدول kyc_documents
- [ ] جدول support_tickets
- [ ] جدول ticket_replies
- [ ] جدول newsletter_subscribers
- [ ] جدول asset_price_history
- [ ] جدول integrations
- [ ] جدول email_templates
- [ ] جدول login_attempts

#### API Endpoints
- [ ] جميع endpoints المذكورة أعلاه

#### الخدمات الخارجية
- [ ] تفعيل Resend
- [ ] تفعيل TwelveData
- [ ] تفعيل Twilio/WhatsApp
- [ ] إعداد Cron لتحديث الأسعار

#### الأمان
- [ ] httpOnly cookies للـ JWT
- [ ] Rate limiting
- [ ] 2FA للمشرفين
- [ ] تحقق من صلاحيات精细化
- [ ] سياسة كلمات مرور قوية

---

## 📈 تقدير الجهد المطلوب

| المهمة | التقدير |
|--------|---------|
| إصلاح الصفحات الوهمية | 3-5 أيام |
| إنشاء الصفحات الناقصة | 5-7 أيام |
| إضافة الجداول الناقصة | 2-3 أيام |
| إضافة API endpoints | 5-7 أيام |
| تفعيل الخدمات الخارجية | 2-3 أيام |
| إصلاح الثغرات الأمنية | 3-4 أيام |
| الاختبار والتكامل | 3-5 أيام |

**إجمالي تقديري:** 23-34 يوم عمل (لمطور واحد)

---

## 🎯 أولويات التنفيذ

### المرحلة 1 - الأمان (عاجل)
1. إصلاح CORS
2. نقل JWT إلى httpOnly cookies
3. إضافة rate limiting

### المرحلة 2 - الوظائف الأساسية
1. إصلاح Security.tsx
2. إصلاح Reports.tsx
3. إصلاح Team.tsx
4. إصلاح Notifications.tsx

### المرحلة 3 - واجهة العميل
1. صفحة الإشعارات
2. صفحة الدعم
3. صفحة KYC
4. صفحة الإعدادات

### المرحلة 4 - الخدمات الخارجية
1. تفعيل Resend
2. تفعيل TwelveData
3. تحديث الأسعار التلقائي

### المرحلة 5 - التلميع
1. Testing شامل
2. تحسين الأداء
3. التوثيق النهائي

---

## 📝 ملاحظات ختامية

- المشروع في حالة "نموذج أولي" متقدم - الواجهة مكتملة بصريًا لكن الوظائف ناقصة
- الثغرات الأمنية يجب معالجتها فورًا قبل أي نشر إنتاجي
- تقديرات الوقت لمطور متمرس

**تحذير:** لا تنشر هذا المشروع على الإنتاج قبل معالجة الثغرات الأمنية المذكورة.

---

*تم إعداد هذه الوثيقة بناءً على تحليل كامل للمستودع في 7 يوليو 2026*

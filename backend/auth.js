const express = require('express');
const bcrypt = require('bcrypt'); // مكتبة لتشفير كلمات المرور
const jwt = require('jsonwebtoken'); // مكتبة لإنشاء وإدارة JSON Web Tokens
const { getDb } = require('./db'); // استيراد دالة الاتصال بقاعدة البيانات

const router = express.Router(); // إنشاء راوتر للـ API
const secret = 'your_jwt_secret'; // المفتاح السري لتوقيع الـ JWT (يجب تخزينه بأمان)

router.post('/register', async (req, res) => {
  const { username, password } = req.body; // الحصول على بيانات المستخدم من الطلب
  const hashedPassword = bcrypt.hashSync(password, 10); // تشفير كلمة المرور باستخدام bcrypt

  try {
    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('admins'); // اختيار مجموعة (collection) المستخدمين "admins"

    // التحقق إذا كان المستخدم موجودًا بالفعل
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists'); // إذا كان المستخدم موجودًا بالفعل، يتم إرسال خطأ
    }

    // إدراج المستخدم الجديد في قاعدة البيانات
    await collection.insertOne({ username, password: hashedPassword });
    res.status(201).send('User registered'); // إرسال رسالة نجاح عند تسجيل المستخدم
  } catch (err) {
    console.error('Error during registration:', err); // طباعة الخطأ إلى وحدة التحكم إذا حدث خطأ
    res.status(500).send('Server error'); // إرسال رسالة خطأ إلى العميل
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body; // الحصول على بيانات المستخدم من الطلب

  try {
    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('admins'); // اختيار مجموعة (collection) المستخدمين "admins"

    // البحث عن المستخدم في قاعدة البيانات
    const user = await collection.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found'); // إذا لم يتم العثور على المستخدم، يتم إرسال خطأ
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password); // مقارنة كلمة المرور المدخلة مع كلمة المرور المخزنة
    if (!passwordIsValid) {
      return res.status(401).send('Invalid password'); // إذا كانت كلمة المرور غير صحيحة، يتم إرسال خطأ
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' }); // إنشاء توكن JWT للمستخدم
    res.status(200).send({ auth: true, token }); // إرسال التوكن إلى العميل مع رسالة نجاح
  } catch (err) {
    console.error('Error during login:', err); // طباعة الخطأ إلى وحدة التحكم إذا حدث خطأ
    res.status(500).send('Server error'); // إرسال رسالة خطأ إلى العميل
  }
});

module.exports = router; // تصدير الراوتر ليتم استخدامه في مكان آخر في التطبيق

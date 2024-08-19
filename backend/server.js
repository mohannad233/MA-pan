const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const authRoutes = require('./auth');
const productRoutes = require('./products');
const path = require('path');
const { connectToDatabase } = require('./db'); // استيراد الدالة للاتصال بقاعدة البيانات

const app = express();
const port = process.env.PORT || 3001; // استخدام المتغير PORT من البيئة إذا كان موجوداً، وإلا استخدام 3001

// الاتصال بقاعدة البيانات عند بدء تشغيل الخادم
connectToDatabase();

app.use(cors()); // السماح بالتواصل عبر النطاقات المختلفة (CORS)
app.use(bodyParser.json()); // تحليل الطلبات التي تحتوي على JSON
app.use(bodyParser.urlencoded({ extended: true })); // تحليل الطلبات التي تحتوي على بيانات مشفرة في الـ URL
app.use('/auth', authRoutes); // استخدام المسار /auth لتوجيه جميع الطلبات المتعلقة بالمصادقة إلى authRoutes
app.use('/products', productRoutes); // استخدام المسار /products لتوجيه جميع الطلبات المتعلقة بالمنتجات إلى productRoutes

// خدمة ملفات الصور
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // تقديم الملفات الساكنة الموجودة في مجلد uploads

// إعداد نقطة النهاية لإرسال البريد الإلكتروني
app.post('/send-email', (req, res) => {
  const { email, subject, message } = req.body;

  // إعداد Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'mohannad.d1818@gmail.com', // بريدك الإلكتروني
      pass: 'tukzyygtvlriwsxp', // كلمة مرور التطبيق التي حصلت عليها
    },
  });

  const mailOptions = {
    from: email, // البريد المرسل
    to: 'aliomari1996zz@gmail.com', // البريد المستلم
    subject: subject, // الموضوع
    text: message, // نص الرسالة
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // سجل الخطأ
      return res.status(500).send('Error sending email'); // إرسال رد خطأ
    }
    console.log('Email sent:', info.response); // سجل الاستجابة الناجحة
    res.status(200).send('Email sent successfully'); // إرسال رد نجاح
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // سجل أن الخادم يعمل وبأي منفذ
});

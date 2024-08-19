const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp'); // استيراد مكتبة sharp لضغط وتحويل الصور
const { getDb, connectToDatabase } = require('./db'); // استيراد الاتصال بقاعدة البيانات

const router = express.Router();

// إعداد multer لتخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // تحديد مسار تخزين الملفات المحملة
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // تسمية الملفات المحملة بإضافة التوقيت الحالي
  }
});

const upload = multer({ storage });

// إضافة منتج مع صورة
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, calories, section, available } = req.body; // استخراج البيانات من الطلب
    let image = null;
    
    // إذا كانت الصورة محملة، يتم تعديل حجمها وضغطها باستخدام sharp
    if (req.file) {
      const imagePath = `uploads/${Date.now()}-${req.file.originalname}`;
      await sharp(req.file.path)
        .resize(800) // تغيير حجم الصورة
        .webp({ quality: 80 }) // تحويل الصورة إلى WebP وضغطها
        .toFile(imagePath); // حفظ الصورة المعدلة
      image = `/${imagePath}`; // حفظ مسار الصورة
    }

    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('products'); // الوصول إلى مجموعة المنتجات

    const newProduct = {
      name,
      price,
      calories: calories || null,
      image,
      section,
      available: available === 'true',
    };

    await collection.insertOne(newProduct); // إضافة المنتج إلى قاعدة البيانات
    res.status(201).send({ status: 'success' }); // إرسال رد نجاح
  } catch (err) {
    console.error('Unexpected error:', err); // سجل أي خطأ غير متوقع
    res.status(500).send('Unexpected server error'); // إرسال رد خطأ
  }
});

// الحصول على جميع المنتجات
router.post('/get_all', async (req, res) => {
  try {
    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('products'); // الوصول إلى مجموعة المنتجات

    const products = await collection.find({}).toArray(); // جلب جميع المنتجات من قاعدة البيانات وتحويلها إلى مصفوفة
    res.status(200).send(products); // إرسال المنتجات كاستجابة
  } catch (err) {
    console.error('Database error:', err); // سجل الخطأ
    res.status(500).send('Server error'); // إرسال رد خطأ
  }
});

// تعديل منتج معين
router.post('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, calories, section, available } = req.body; // استخراج البيانات من الطلب
    let image = null;

    // إذا كانت الصورة محملة، يتم تعديل حجمها وضغطها باستخدام sharp
    if (req.file) {
      const imagePath = `uploads/${Date.now()}-${req.file.originalname}`;
      await sharp(req.file.path)
        .resize(800) // تغيير حجم الصورة
        .webp({ quality: 80 }) // تحويل الصورة إلى WebP وضغطها
        .toFile(imagePath); // حفظ الصورة المعدلة
      image = `/${imagePath}`; // حفظ مسار الصورة
    }

    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('products'); // الوصول إلى مجموعة المنتجات

    const updateFields = {
      name,
      price,
      calories: calories || null,
      section,
      available: available === 'true',
    };

    if (image) {
      updateFields.image = image; // تحديث مسار الصورة إذا كانت موجودة
    }

    const result = await collection.updateOne(
      { _id: new require('mongodb').ObjectID(req.params.id) }, // تحديد المنتج بواسطة _id
      { $set: updateFields } // تحديد الحقول التي سيتم تحديثها
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Product not found'); // إذا لم يتم العثور على المنتج، إرسال رد خطأ 404
    }

    res.status(200).send({ status: 'success' }); // إرسال رد نجاح
  } catch (err) {
    console.error('Unexpected error:', err); // سجل أي خطأ غير متوقع
    res.status(500).send('Unexpected server error'); // إرسال رد خطأ
  }
});

// حذف منتج معين
router.post('/delete/:id', async (req, res) => {
  try {
    const db = getDb(); // الحصول على اتصال بقاعدة البيانات
    const collection = db.collection('products'); // الوصول إلى مجموعة المنتجات

    const result = await collection.deleteOne({ _id: new require('mongodb').ObjectID(req.params.id) }); // حذف المنتج بواسطة _id

    if (result.deletedCount === 0) {
      return res.status(404).send('Product not found'); // إذا لم يتم العثور على المنتج، إرسال رد خطأ 404
    }

    res.status(200).send({ status: 'success' }); // إرسال رد نجاح
  } catch (err) {
    console.error('Database error:', err); // سجل الخطأ
    res.status(500).send('Server error'); // إرسال رد خطأ
  }
});

module.exports = router; // تصدير الراوتر ليتم استخدامه في التطبيق الرئيسي

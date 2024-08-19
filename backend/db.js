const { MongoClient } = require('mongodb');

// Connection String الخاص بك من MongoDB Atlas
const uri = "mongodb+srv://pan:Noor1818@cluster0.uif76.mongodb.net/pan?retryWrites=true&w=majority";

let client;
let db;

/**
 * وظيفة الاتصال بقاعدة البيانات MongoDB
 * تقوم هذه الوظيفة بإنشاء اتصال بقاعدة البيانات باستخدام MongoClient.
 * يتم استخدام uri الذي يحتوي على معلومات الاتصال بـ MongoDB.
 * في حال نجاح الاتصال، يتم تخزين الاتصال في المتغير db.
 * في حال حدوث خطأ، يتم تسجيله والخروج من التطبيق.
 */
async function connectToDatabase() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('pan'); // اختر اسم قاعدة البيانات الخاصة بك
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // الخروج من التطبيق إذا لم ينجح الاتصال
  }
}

/**
 * دالة لاسترداد الاتصال بقاعدة البيانات
 * إذا لم يتم إنشاء الاتصال بعد، يتم إصدار خطأ يطلب من المستخدم الاتصال بقاعدة البيانات أولاً.
 */
function getDb() {
  if (!db) {
    throw new Error('Database not connected. Please call connectToDatabase first.');
  }
  return db;
}

module.exports = { connectToDatabase, getDb };

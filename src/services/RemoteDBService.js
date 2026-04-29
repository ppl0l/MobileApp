import { collection, addDoc, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const CLOUDINARY_CLOUD_NAME = 'dvszphzet';
const CLOUDINARY_UPLOAD_PRESET = 'ml_def';

export const remoteDB = {
  async saveOrder(orderData) {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error('Нет авторизованного пользователя');
        return null;
      }
      
      const docRef = await addDoc(collection(db, "users", userId, "orders"), {
        ...orderData,
        userId: userId,
        timestamp: Date.now()
      });
      
      return { id: docRef.id };
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async uploadImage(uri) {
    if (!uri) return "";
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('file', {
        uri: uri,
        name: filename,
        type: type
      });
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result.secure_url || "";
    } catch (error) {
      return "";
    }
  },

  subscribeToOrders(callback) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('Нет авторизованного пользователя');
      return () => {};
    }
    
    const q = query(
      collection(db, "users", userId, "orders"), 
      orderBy("timestamp", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach((doc) => {
        orders.push({ 
          id: doc.id,
          firebaseId: doc.id,
          ...doc.data()
        });
      });
      callback(orders);
    });
  }
};
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getOrders, deleteOrder } from '../utils/database';

class AuthService {
  constructor() {
    this.user = null;
    this.listeners = [];
  }

  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
      this.notifyListeners();
      return { success: true, user: this.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
      this.notifyListeners();
      return { success: true, user: this.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await signOut(auth);
      this.user = null;
      
      const orders = await getOrders();
      for (const order of orders) {
        await deleteOrder(order.id);
      }
      
      this.notifyListeners();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  addListener(callback) {
    this.listeners.push(callback);
    callback(this.user);
    return () => this.removeListener(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.user));
  }

  initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      this.user = user;
      
      if (user) {
        const orders = await getOrders();
        for (const order of orders) {
          await deleteOrder(order.id);
        }
      }
      
      this.notifyListeners();
    });
  }
}

export const authService = new AuthService();
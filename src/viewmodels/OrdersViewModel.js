import { networkMonitor } from '../services/NetworkMonitor';
import { apiService } from '../services/APIService';
import { OrderModel } from '../models/OrderModel';
import { getOrders, addOrder, deleteOrder, cacheApiData, getCachedApiData, updateFirebaseId } from '../utils/database';
import { remoteDB } from '../services/RemoteDBService';

export class OrdersViewModel {
  constructor() {
    this.allOrders = [];
    this.filteredOrders = [];
    this.apiData = [];
    this.isConnected = true;
    this.isLoading = false;
    this.listeners = new Set();
    this.syncingInProgress = false;
    this.localIdsToFirebaseIds = new Map();
    
    networkMonitor.addListener((c) => {
      this.isConnected = c;
      this.notifyListeners();
    });
  }

  subscribe(l) {
    this.listeners.add(l);
    l(this.getState());
    return () => this.listeners.delete(l);
  }

  notifyListeners() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }

  getState() {
    return {
      orders: this.filteredOrders,
      apiData: this.apiData,
      isConnected: this.isConnected,
      isLoading: this.isLoading
    };
  }

  fuzzySearch(text) {
    if (!text) {
      this.filteredOrders = [...this.allOrders];
    } else {
      const s = text.toLowerCase();
      this.filteredOrders = this.allOrders.filter(o => 
        o.title.toLowerCase().includes(s) || 
        (o.description && o.description.toLowerCase().includes(s))
      );
    }
    this.notifyListeners();
  }

  sortOrders(criteria) {
    if (criteria === 'name') {
      this.filteredOrders.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      this.filteredOrders.sort((a, b) => b.id - a.id);
    }
    this.notifyListeners();
  }

  async loadOrders() {
    const data = await getOrders();
    this.allOrders = data.map(OrderModel.fromDatabase);
    this.filteredOrders = [...this.allOrders];
    
    this.localIdsToFirebaseIds.clear();
    this.allOrders.forEach(order => {
      if (order.firebaseId) {
        this.localIdsToFirebaseIds.set(order.id, order.firebaseId);
      }
    });
    
    this.notifyListeners();
  }

  async addOrder(title, description, date, type, imageUri) {
    this.isLoading = true;
    this.notifyListeners();
    
    let remoteUrl = "";
    let firebaseId = null;
    
    try {
      if (imageUri && this.isConnected) {
        remoteUrl = await remoteDB.uploadImage(imageUri);
      }
      
      const result = await addOrder(title, description, date, type, remoteUrl, null);
      const localOrderId = result.lastInsertRowId;
      
      if (this.isConnected) {
        const fbResult = await remoteDB.saveOrder({ 
          title, 
          date, 
          type, 
          imageUrl: remoteUrl, 
          timestamp: Date.now(),
          description: description || '',
          localId: localOrderId
        });
        
        if (fbResult && fbResult.id) {
          firebaseId = fbResult.id;
          await updateFirebaseId(localOrderId, firebaseId);
          this.localIdsToFirebaseIds.set(localOrderId, firebaseId);
        }
      }
      
      await this.loadOrders();
      await this.fetchApiData();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
      this.notifyListeners();
    }
  }

  async deleteOrder(id) {
    await deleteOrder(id);
    await this.loadOrders();
  }

  async fetchApiData() {
    const key = 'recommended_meal';
    if (this.isConnected) {
      const res = await apiService.fetchApiData();
      if (res.success) {
        this.apiData = res.data;
        await cacheApiData(key, res.data);
      }
    } else {
      const cached = await getCachedApiData(key);
      if (cached) {
        this.apiData = cached;
      }
    }
    this.notifyListeners();
  }

  async syncWithFirebase(firebaseOrders) {
    if (this.syncingInProgress) return;
    this.syncingInProgress = true;
    
    try {
      const localOrders = await getOrders();
      const existingFirebaseIds = new Set(
        localOrders.filter(o => o.firebaseId).map(o => o.firebaseId)
      );
      
      const pendingLocalIds = new Set();
      localOrders.forEach(order => {
        if (!order.firebaseId && order.title) {
          pendingLocalIds.add(order.title + order.date);
        }
      });
      
      for (const fbOrder of firebaseOrders) {
        if (existingFirebaseIds.has(fbOrder.firebaseId || fbOrder.id)) {
          continue;
        }
        
        const orderKey = fbOrder.title + fbOrder.date;
        if (pendingLocalIds.has(orderKey)) {
          continue;
        }
        
        const existsByContent = localOrders.some(order => 
          order.title === fbOrder.title && 
          order.date === fbOrder.date
        );
        
        if (!existsByContent && fbOrder.title) {
          await addOrder(
            fbOrder.title, 
            fbOrder.description || '', 
            fbOrder.date, 
            fbOrder.type || 'order', 
            fbOrder.imageUrl || '',
            fbOrder.firebaseId || fbOrder.id
          );
        }
      }
      
      await this.loadOrders();
    } catch (error) {
      console.error(error);
    } finally {
      this.syncingInProgress = false;
    }
  }
}
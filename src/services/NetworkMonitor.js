import NetInfo from '@react-native-community/netinfo';

class NetworkMonitor {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
    this.init();
  }

  init() {
    NetInfo.addEventListener(state => {
      const wasConnected = this.isConnected;
      this.isConnected = state.isConnected && state.isInternetReachable;
      
      if (wasConnected !== this.isConnected) {
        this.notifyListeners();
      }
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
    callback(this.isConnected);
    return () => this.removeListener(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isConnected));
  }
}

export const networkMonitor = new NetworkMonitor();
export class OrderModel {
  constructor(id, title, description, date, type = 'order', imageUrl = '') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.type = type;
    this.imageUrl = imageUrl;
  }

  static fromDatabase(data) {
    return new OrderModel(
      data.id, 
      data.title, 
      data.description, 
      data.date,
      data.type || 'order',
      data.imageUrl || ''
    );
  }
}
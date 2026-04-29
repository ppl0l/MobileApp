export class APIService {
  async fetchApiData() {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      if (data && data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        return {
          success: true,
          data: [{
            title: meal.strMeal,
            area: meal.strArea || 'Кухня мира',
          }],
        };
      }
      return { success: false, data: [] };
    } catch (error) {
      return { success: false, data: [] };
    }
  }
}

export const apiService = new APIService();
class Utils {
  constructor(){

  }
  
// Filters the object and returns keys where the value is defined
  filterObject(productObj){
    const allowedKeys = ['name', 'description', 'image', 'brand', 'category', 'currentPrice', 'prevPrice', 'initialQuantity', 'quantityRemaining'];
    return Object.fromEntries(
      Object.entries(productObj).filter(([key, value]) => value !== undefined && allowedKeys.includes(key))
    );
  }
}

module.exports = new Utils()
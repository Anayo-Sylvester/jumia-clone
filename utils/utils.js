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

  //convert string with "," to string without ","
  commaSeparator(word){
    return word.replace(/,/g, " ");
  }

  //replace string with "-" with " "
  hyphenSeparator(word){
    word = word.replace(/-/g," ");
    console.log(word)
  }

  convertPriceToMinAndMax(price){
    const [min,max] = price.split("-");
    return {min:Number(min),max:Number(max)}

  }
}

module.exports = new Utils()
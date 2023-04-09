export const randHSL = {
  /**
   * Returns a random color
   * @returns {import("three").ColorRepresentation}
   */
  default: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
  },

  /**
   * Returns a pastel color
   * @returns {import("three").ColorRepresentation}
   */
  pastel: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, ${Math.random() * 10 + 80}%, 75%)`
  },

  /**
   * Returns a monochrome color
   * @returns {import("three").ColorRepresentation}
   */
  noColor: function(){
    return `hsl(100, 0%, ${Math.random() * 40 + 30}%)`
  }
}

export const maths = {
  /**
   * Gets a number between `min` and `max`
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  between: function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  ease:{
    /**
     * InOutQuart easing function
     * @param {number} x 
     * @returns {number}
     */
    inOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },

    /**
     * In easing function
     * @param {number} x 
     * @returns {number}
     */
    inQuad: function(x) {
      return x * x;
    },
  }
}

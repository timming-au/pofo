export const randHSL = {
  default: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
  },
  pastel: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, ${Math.random() * 10 + 80}%, 75%)`
  },
  noColor: function(){
    return `hsl(100, 0%, ${Math.random() * 40 + 30}%)`
  }
}
export const maths = {
  between: function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  ease:{
    inOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },
    inQuad: function(x) {
      return x * x;
    },
  }
}

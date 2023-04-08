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

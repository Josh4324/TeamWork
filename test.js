/* console.log("Hello world");
var variable = "Hello World";
variable = "2";
console.log(variable); */

//conditionals

/* if (variable === "Hello") {
    console.log("yes");

} else if (variable == 2) {
    console.log(2);
} else {
    console.log("no");
}
 */
//Boolean
/* if (true){
    console.log("One")
}else{
    console.log("false");
}
 */
//loops

/* for(let i=0; i < 5; i++){
    console.log(i)
} */

//Guess Game

//predict a number
//guess the number
//if the number is correct - You are correct
// if the number is wrong - You are wrong



const guess = (num) => {
    const rand = Math.round((Math.random() * 10))
    if (num === rand) {
        console.log("You are correct")
    } else {
        console.log("You are wrong")
    }
}

guess(10);
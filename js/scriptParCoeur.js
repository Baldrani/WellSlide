/* Mon commentaire */
//Autre Commentaire

var maVariable = "string";
var maVariable2 = 23;
var maVariable3 = 23.5;
var start = 2;

var isPrime = true;

do{
    var number = prompt("Entre un nombre premier");
}while( !Number.isInteger(parseFloat(number)))
if (number < start){
        isPrime = false;
    } else {
        for(; start < Math.sqrt(number); start++){
            if( !(number%start)){
                isPrime = false;
                break;
            }
        }
    }
if(isPrime){
    document.body.innerHTML += "<br>" +  number + " est un nombre premier";
}else{
    document.body.innerHTML += "<br>" + number + " n'est pas un nombre premier";
}

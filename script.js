//this will not work with browsers not supporting ES6 because I like local variables.
//document parts
const expressionInput = document.getElementById("in");
//const evalBtn = document.getElementById("evalBtn")
//var bitwise=false
const prenots="!~¬"//for all that are not in square brackets, please do .split("")
//const postnot="'" commented out for being pointless but being good for documentation
const ands="&*·ϗ⁊∧∩"
const nands="|¦↑⊽"
const xors=["XOR","^","⊕"]
const ors=["||","¦¦","+","V","∪"]
const nors=["↓","⊼","↑↑"]
const imps=["->","→","⇒","⊃"]//implication, its reverse
const pmis=["<-","←","⇐","⊂"]
/*
const nonprefix_operands=()=>{return ("'+10V↓⊼∪"+ands+nands).split("").concat(xors).concat(imps).concat(pmis).concat("==")}//evil trick to reduce redundancy in memory and code
const tokenise=(expr)=>{
    let q="\\"+(nonprefix_operands().concat(prenots.split()).join("|\\"))
    return expr.split(RegExp("(?=\s["+q+"])|(?<=\s["+q+"])/u")).reverse()
}*/
const tokenise=(expr)=>{
    let operands=("'+10↓⊼"+prenots+ands).split("").concat(xors).concat(imps).concat(pmis).join("|");//reduces redundancy
    return expr.split(RegExp("("+operands+")"))
}
/*
normalise=(op)=>{
    if op in ands
}
//function bitarrayaccess(arr,bit){return Boolean(arr[bit>>3+1]>>(bit%8)&true)}//please use Uint8Array for arr and bigint for bit
function bitarraypush(x,arr,len){
    arr[()=>{if(len){return len-1>>5}else{return false}}]|=(x>>(length%32))
}
//function bitarraypop(x,arr,bit)
function shunt(orders){
    let [operators,values,bits]=[Uint16Array,Uint16Array,Uint32Array]//operators is the unicodes of the chosen characters
    //values is a bit array and bits is its length.
    while(orders.length()){
        let [order,type]=[orders.pop(),Uint8ClampedArray];//type is a single value array where 0:literal 1:prefix 2:infix 3:suffix 4:bracket
        switch(true){
            case(order.match("/\s")):break;
            case(prenots.includes(order)):operators.push(0x21);break;
            case(Set(["|","¦","↑"]).has(order)):if(order==orders[length(orders)-1]){order+=orders.pop()}else{break}
            case(Set(["1","0"].has(order))):bitarraypush(Boolean(order));break
            case((type[0]==2)||infix_operands().includes(order)):
                {}
        }
    }
}
/*
const tokenise=(expr)=>{
    let tokens=[];
    let i=null;
    try{i=BigInt(0)}catch{i=0}
    while(i<expr.length){
        if(/\s/.match(expr[i])){i++}
        else if(prenots.includes(expr[i]){tokens.push(["~"])})
        else {while tokens.push(["V",expr[i]])}
    }
}
*/

document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    console.log(tokenise(document.getElementById("in").value))
    //console.log(shunt(tokenise(document.getElementById("in"))))
})
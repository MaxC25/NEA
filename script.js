// Encoding: UTF-8
//this will not work with browsers not supporting ES6 because I like local variables.
//document parts
//const expressionInput = document.getElementById("in");
//const evalBtn = document.getElementById("evalBtn")
//var bitwise=false
var vars=[]
const prenots="!~¬"//for all that are not in square brackets, please do .split("")
//const postnot="'" commented out for being pointless but being good for documentation
const ands="&*·ϗ⁊∧∩"
const nands="|¦↑⊽"
const xors=["⊕","XOR","^"]
const ors=["V","||","¦¦","+","∪"]
const nors=["↓","⊼","↑↑"]
const imps=["→","->","⇒","⊃"]//implication then its reverse
const pmis=["←","<-","⇐","⊂"]
const equals=["≡","=="]
const parens="()"
Array.prototype.last=function(){return this[this.length-1]}
function tokenise(expr){/*
_____
|   |
|   |
\   /
 \ /
  |
  |
-----
FRAGILE */
    let operands=("()'+10↓⊼"+prenots+ands+nands).split("").concat(xors).concat(imps).concat(pmis).concat(equals).map((a)=>a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));//the list reduces redundancy and the map escapes
    return expr.split(RegExp("("+operands.join("|")+"|\\s)")).reverse()
}
function prec(op){switch(op){//should probably change it to something more flexible like what Haskell does.
    case"(":case")":return false
    case"!":case"'":return true
    case"&":case"|":return 2
    case"⊕":return 3
    case"V":case"↓":return 4
    case"→":case"←":return 6
    case"≡":return 0xFE
}}
function shunt(orders){
let [out,ops,t]=[[],[],Uint8Array];
while(orders.length){
let order=orders.pop();
if(order===""){order=orders.pop()}
if(orders.last()===""){orders.pop()}
t[0]=false
let nnorm=(T,F)=>orders.last()==="'"?(orders.pop(),F):T;
if(["|","¦","↑"].includes(order)){orders.last()===order?(()=>order+=orders.pop(),order=(ors.slice(1,3).includes(order)?nnorm("V","↓"):nnorm("↓","V"))):order=nnorm(order,"|","&");t[0]=2}
else{//normalises
["1","0"].includes(order)?out.push(Boolean(order)):
["(","'"].includes(order)?operators.push(order):
")"===order?operators.push(order):
prenots.includes(order)?operators.push("~"):
ands.includes(order)?[t[0],order]=[2,"&"]:
nands.includes(order)?[t[0],order]=[2,"|"]:
xors.includes(order)?[t[0],order]=[2,"⊕"]:
ors.includes(order)?[t[0],order]=[2,"V"]:
nors.includes(order)?[t[0],order]=[2,"↓"]:
imps.includes(order)?[t[0],order]=[2,"→"]:
pmis.includes(order)?[t[0],order]=[2,"←"]:
equals.includes(order)?[t[0],order]=[2,"="]:out.push(order)
}
if(t[0]==2){while(ops.length&&ops.last()!="("&&((prec(ops.last())>prec(order))||((prec(order)===prec(ops.last))&&(order==="→")))){out.push(ops.last())}ops.push(order)}
else if(order===")"){while(ops.last!="("){out.push(ops.pop())}}
}
while(ops.length&&ops.last!="("){out.push(ops.pop())}
if(ops.last==="("){console.error("mismatched brackets")}
return out
}

document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    //console.log(tokenise(document.getElementById("in").value))
    console.log(shunt(tokenise(document.getElementById("in").value)))
})
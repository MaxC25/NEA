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
const correctible=["->","&","==","|","~","E","N","V","⊕'"]
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
function shunt(orders){//the shunting yard
let [out,ops,t,normals]=[[],[],Uint8Array,new Set("&|⊕V↓→←≡".split(""))];//t is a single byte representing type where 0:undeclared 1:prefix 2:infix 3:suffix 4:bracket 5:literal_or_reference
while(orders.length){
let order=orders.pop();
while((order==="")||/^\s*$/.test(order)){order=orders.pop()}
if(orders.last()===""){orders.pop()}
t[0]=false
let TF=(T,F)=>F?(orders.last()==="'"?(orders.pop(),F):T):orders.last()==="'"?(T+orders.pop()):T;//normalises and deals with negated operators
if(["|","¦","↑"].includes(order)){orders.last()===order?(()=>order+=orders.pop(),(orders.last()===""?orders.pop():null),order=(ors.slice(1,3).includes(order)?TF("V","↓"):TF("↓","V"))):order=TF(order,"|","&");t[0]=2}//deals with weird non-prefix nature of ¦¦, also this is the only bit of old code left as it was the only bit known to work.
else{//normalises
["1","0"].includes(order)?out.push(Boolean(order)):
order==="("?ops.push(order):
order==="'"?out.push("'"):
prenots.includes(order)?ops.push("~"):
(orders.last()!=="'")&&normals.has(order)?t[0]=2:
ands.includes(order)?[t[0],order]=[2,TF("&",'|')]:
nands.includes(order)?[t[0],order]=[2,TF("|","&")]:
xors.includes(order)?[t[0],order]=[2,TF("⊕")]:
[ors[1],...ors.slice(2)].includes(order)?[t[0],order]=[2,TF("V","↓")]:
nors.includes(order)?[t[0],order]=[2,TF("↓","V")]:
imps.includes(order)?[t[0],order]=[2,TF("→")]:
pmis.includes(order)?[t[0],order]=[2,TF("←")]:
equals.includes(order)?[t[0],order]=[2,TF("≡")]://end of normalisation.
order==="="?t[0]=2:out.push(order)
}
if(t[0]==2){while(ops.length&&ops.last()!="("&&((prec(ops.last())>prec(order))||((prec(order)===prec(ops.last))&&(["→".has(order)])))){out.push(ops.last())}ops.push(order)}
else if(order===")"){while(ops.last!="("){out.push(ops.pop())}}
}
while(ops.length&&ops.last!="("){out.push(ops.pop())}
if(ops.last==="("){console.error("mismatched brackets")}
return out
}
function RPNpedant(a){
switch(a){
  case "~":case "N": return "'";
  case "V":return "A";
  case "&":return "K";
  case "|":return "D";
  case "->":return "C";
  case"E":case "==":case"⊕'":return "Q";
}
}
function RPNlike(a){if(a==="~"){return "'"}}//not true
document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    //console.log(tokenise(document.getElementById("in").value))
    console.log(shunt(tokenise(document.getElementById("in").value)))
})
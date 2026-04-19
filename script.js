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
Array.prototype.last=function(){return this[this.length--]}
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
    let operands=("()'+↓⊼"+prenots+ands+nands).split("").concat(xors).concat(imps).concat(pmis).concat(equals).map((a)=>a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'));//the list reduces redundancy and the map escapes
    return expr.split(RegExp("("+operands.join("|")+"|\\s)")).reverse()
}
function prec(op){switch(op){//should probably change it to something more flexible like what Haskell does. Also, lower number, higher precedence
    case"(":case")":return false
    case"!":case"'":return true
    case"&":case"|":return 2&0xFF//&0xFF in all good JS implementations converts to uint8, and JS has no way to 
    case"⊕":return 3&0xFF
    case"V":case"↓":return 4&0xFF
    case"→":case"←":return 6&0xFF
    case"≡":return 0xFE&0xFF
}}

function shunt(orders){//the shunting yard
let [out,ops,t,normals]=[[],[],Uint8Array,new Set("&|⊕V↓→←≡".split(""))];//t is a single byte representing type where 0:undeclared 1:prefix 2:infix 3:suffix 4:bracket 5:literal_or_reference
while(orders.length){
let order=orders.pop();
while((order==="")||/^\s*$/.test(order)){order=orders.pop()}
while(orders.last()===""){orders.pop()}
t[0]=false
let TF=(T,F)=>F?(orders.last()==="'"?(orders.pop(),F):T):orders.last()==="'"?(T+orders.pop()):T;//normalises and deals with negated operators. T is the operator and F is its complement
if(["|","¦","↑"].includes(order)){
orders.last()===order?
(order+=orders.pop(),(orders.last()===""?orders.pop():null),order=(order==="↑↑")?TF("↓","V"):TF("V","↓")):
order=TF(order,"|","&");t[0]=2}//deals with weird non-prefix nature of ¦¦, also this is the only bit of old code left as it was the only bit known to work.
else{//normalises
["1","0"].includes(order)?out.push(Boolean(parseInt(order))):
order==="("?ops.push(order):
order==="'"?out.push("'"):
prenots.includes(order)?ops.push("~"):
(orders.last()!=="'")&&normals.has(order)?t[0]=2:/*if it's already normalised, the following a?b:... statements are not needed, so we don't do*/
ands.includes(order)?[t[0],order]=[2,TF("&",'|')]:/*normalises and sets type to 2 for infix while handling the case of a negated operator*/
nands.includes(order)?[t[0],order]=[2,TF("|","&")]:
xors.includes(order)?[t[0],order]=[2,TF("⊕")]:
[ors[1],...ors.slice(2)].includes(order)?[t[0],order]=[2,TF("V","↓")]:
nors.includes(order)?[t[0],order]=[2,TF("↓","V")]:
imps.includes(order)?[t[0],order]=[2,TF("→")]:
pmis.includes(order)?[t[0],order]=[2,TF("←")]:
equals.includes(order)?[t[0],order]=[2,TF("≡")]://end of normalisation.
order==="="?t[0]=2:out.push(order)//the left handles =, right handles variables.
}
if(t[0]==2&0xFF){
  while(ops.length&&ops.last()!=="("&&((prec(ops.last())<prec(order))/*because lower number from prec, higher precedence so < is > and > is <*/||((prec(order)===prec(ops.last()))&&(order==="→")))){
    out.push(ops.pop())}
    ops.push(order)}
  else if(order===")"){while(ops.last()!=="("){out.push(ops.pop())}ops.pop()}
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
//function RPNlike(a){if(a==="~"){return "'"}}//not true

document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    //console.log(tokenise(document.getElementById("in").value))
    console.log(shunt(tokenise(document.getElementById("in").value)))
})
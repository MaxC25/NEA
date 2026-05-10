//import BitArray from "/node_modules/@bitarray/es6/dist/esm/src/bitarray.js"//allows bitarray, replace if desired
// Encoding: UTF-8
//this will not work with browsers not supporting ES6 because I like local variables.
const OUTBOX=document.getElementById("out")
try{Number.prototype&=0xFF}catch{}//try to make number.prototype 8 bit.
const [C,CC]=[((p,q)=>~p|q),((p,q)=>!p||q)]//imply in RPN, duplication to mean logical
const [L,LL]=[((p,q)=>p&~q),((p,q)=>p&&!q)]//nimply, note: incorrect notation used for or in LL
const prenots="!~¬"//for all that are not in square brackets, please do .split("")
//const postnot="'" commented out for being pointless but being good for documentation
const $=x=>k=>$(k(x))//useful chaining omniparic stuff
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
const IsNum=a=>(a===!!a)||(typeof a==="number")//checks if of number-like-type
Array.prototype.last=function(){return this[this.length-1]}
Iterator.prototype.last=function(){return this[this.length-1]}
//imply(a,b)=!a||b
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
    case"&":case"|":return 2&0xFF//&0xFF in all good JS implementations casts to uint8, and JS has no way to explicitly cast to int.
    case"⊕":return 3&0xFF
    case"V":case"↓":return 4&0xFF
    case"→":case"←":return 6&0xFF
    case"≡":return 0xFE&0xFF
    case"=":return 0xFF&0xFF//yes, that looks silly but I need it to be a uint8.
}}

function shunt(orders){//the shunting yard, correct means that it's pipelined with the corrector.
let [out,ops,t,normals]=[[],[],Uint8Array,new Set("&=|⊕V↓→←≡".split(""))];//t is a single byte representing type where 0:undeclared 1:prefix 2:infix 3:suffix 4:bracket 5:literal_or_reference
while(orders.length){
let order=orders.pop();
while((order==="")||/^\s*$/.test(order)){order=orders.pop()}
while(orders.last()===""){orders.pop()}
t[0]=false
let TF=(T,F)=>F?(orders.last()==="'"?(orders.pop(),F):T):orders.last()==="'"?(T+orders.pop()):T;//If the operator is negated F, otherwise T
if(["|","¦","↑"].includes(order)){
orders.last()===order?
(order+=orders.pop(),(orders.last()===""?orders.pop():null),order=(order==="↑↑")?TF("↓","V"):TF("V","↓")):
order=TF(order,"|","&");t[0]=2}//deals with weird non-prefix nature of ¦¦, also this is the only bit of old code left as it was the only bit known to work.
else{//normalises
["1","0"].includes(order)?out.push(Boolean(parseInt(order))):
order==="("?ops.push(order):
order==="'"?out.push("'"):
prenots.includes(order)?ops.push("'"):
(orders.last()!=="'")&&normals.has(order)?t[0]=2:/*if it's already normalised, the following a?b:... statements are not needed, so we don't do*/
ands.includes(order)?[t[0],order]=[2,TF("&",'|')]:/*normalises and sets type to 2 for infix while handling the case of a negated operator*/
nands.includes(order)?[t[0],order]=[2,TF("|","&")]:
xors.includes(order)?[t[0],order]=[2,TF("⊕")]:
[ors[1],...ors.slice(2)].includes(order)?[t[0],order]=[2,TF("V","↓")]:
nors.includes(order)?[t[0],order]=[2,TF("↓","V")]:
imps.includes(order)?[t[0],order]=[2,TF("→")]:
pmis.includes(order)?[t[0],order]=[2,TF("←")]:
equals.includes(order)?[t[0],order]=[2,TF("≡")]://end of normalisation.
order===")"?void 0:out.push(order)//"(" is to deal with later
}
if(t[0]==2&0xFF){
  while(ops.length&&ops.last()!=="("&&((prec(ops.last())<prec(order))||((prec(order)===prec(ops.last()))&&(order==="→")))){//prec(ops.last())<prec(order) because lower number from prec, higher precedence so < is > and > is <
    out.push(ops.pop())}
    ops.push(order)}
else if(order===")"){while(ops.last()!=="("){out.push(ops.pop())}ops.pop()}
}
while(ops.length&&ops.last()!="("){out.push(ops.pop())}
if(ops.last()==="("){console.error("mismatched brackets")}
return out
}
function RPNpedant(a){
switch(a){
  case "N": return "'";
  case "V":return "A";
  case "↓":return "X";
  case "|":return "D";
  case "&":return "K";
  case "->":case "→":return "C";
  case "->'":case "→'":return "L";
  case "<-":case "←":return "B";
  case "<-'": case"←'":return "M"
  case "=='":case "⊕":return "J";
  case "E":case "==":case "⊕'":return "Q";
  default:return a
}
}

function interpret(RPN,Bwise,vars){//bitwise is an ugly solution for lack of unification between bitwise and logical operators
let out=[];
RPN.reverse();//I will pretend it isn't and pop pops from the start. So now last is first and first is last becuse unshift is slow in V8.
let op
  while(RPN.length){
  op=RPNpedant(RPN.pop())
  if(IsNum(op)){out.push(op)}
  else{
  let tmp=[]//this is for temporary storage of values
  switch(op){//pipelines with the corrector
    case("'"):out.push(Bwise?~out.pop():!out.pop());break;
    case("A"):out.push(Bwise?out.pop()|out.pop():out.pop()||out.pop());break;//or
    case("B"):tmp.push(out.pop());out.push(Bwise?C(tmp[0],out.pop()):CC((tmp[0],out.pop())));break;//converse
    case("C"):tmp.push(out.pop());out.push(Bwise?C(out.pop(),tmp[0]):CC((out.pop(),tmp[0])));break;//imply, o[0] should really be o[1] for the next 3 lines but optimisation.
    case("D"):out.push(Bwise?~(out.pop()&out.pop()):!(out.pop()&&out.pop()));break;//nand
    case("E"):out.push(Bwise?~(out.pop()^out.pop()):out.pop()==out.pop());break//
    case("J"):Bwise?out[out.length-2]^=out.pop():out.push(out.pop()!=out.pop());//XOR
    case("K"):Bwise?out[out.length-2]&=out.pop():out[out.length-2]&&=out.pop();break;//and
    case("L"):tmp.push(out.pop());push(L(out.pop(),tmp[0]),LL((out.pop(),tmp[0])));break;//nimply
    case("M"):tmp.push(out.pop());push(L(tmp[0],out.pop()),LL((tmp[0],out.pop())));break;//ylpmin
    default:try{op.push(vars.get(op.pop()))}catch{throw "non existant value or operator"}
    }
  }
}
return out.pop()
}

document.getElementById("RPN").addEventListener("click", () => {
    //bitwise=false
    //console.log(tokenise(document.getElementById("in").value))
    OUTBOX.innerHTML=(shunt(tokenise(document.getElementById("in").value)).map(a=>RPNpedant(a)).join(" "))
})
document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    //console.log(tokenise(document.getElementById("in").value))
    let a=interpret(shunt(tokenise(document.getElementById("in").value)),document.getElementById("Bwise").checked)
    OUTBOX.innerHTML=a===!!a?a&1:a.tostring(2)
    let b=(a)=>(b)=>a+b
    b=$(-b)
    console.log(b(1)(2))
})
/*
function test() {
  const outputArea = document.getElementById("out")
  //blank the area
  a=[]
  //build a table

  let table = document.createElement("table")
  let thead = document.createElement("thead")

  table.appendChild(thead)


  //at the end!
  OUTBOX.innerHTNL=a.pop

}
*/
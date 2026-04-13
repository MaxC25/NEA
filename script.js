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
function shunt(orders){//first is last and last is first
    let [operators,out,i/*testing*/,type]=[[],[],BigInt(0),Uint8Array]//type is a single value array where 0:null 1:prefix 2:infix 3:suffix 4:bracket 5:literal_or_reference
	let b=orders.length*2
    while(orders.length){
	console.log(i);
        type[0]=false
        let order=orders.pop();
		console.log(order)
		console.log(orders)//So from here-on, orders.last() is the next order
        if(orders.last()===""){orders.pop()}//pre-emptive to reduce pain
        if(order===""||/\s/.test(order)){}
        else if(prenots.includes(order)){operators.push(0x21)}
        else{//mostly operand handling stuff and normalisation
        let type=Uint8Array
	    let nnorm=(O,T,F)=>orders.last()==="'"?(orders.pop(),F):T//a helper function where T is the normal order and F is its complement
	    let norm=(T,F)=>[type[0],order=2,nnorm(order,T,F)]//Half of the boring repeats in one procedure.
        if(["|","¦","↑"].includes(order)){
			orders.last()===order?(()=>order+=orders.pop(),order=(ors.slice(1,3).includes(order)?nnorm(order,"V","↓"):nnorm(order,"↓","V"))):
			order=nnorm(order,"|","&");
			type[0]=2
		}
        var chkorder=(A)=>A.slice(1).includes(order);//A is not neccecarilly the order but rather is the operator we are checking if the order is.
        var chkorderstr=(A)=>A.substr(1).includes(order);
	    type[0]=2?void 0://if it is, it's already normalised 
        order==="("?operators.push("("):
        order==="'"?out.push(order):
        orders.last()!=="'"&&new Set(["&","|","⊕","V","↓","→","←","=="]).has(order)&&orders?()=>type[0]=2://ensures atomic rewrites, not neccecarry but good practice
        chkorderstr(ands)?norm("&","|"):
        chkorderstr(nands)?norm("|","&"):
        chkorder(xors)?norm("⊕","⊕'"):
        ["+","∪"].includes(order)?norm("V","↓"):
        chkorder(nors)?norm("↓","V"):
        chkorder(imps)?norm("→","→'"):
        chkorder(pmis)?norm("←","←'"):
        chkorder(equals)?norm("==","=/="):
	    ["1","0"].includes(order)?()=>out.push(Boolean(Number(order))):()=>type[0]=5,out.push(order)//normailsation done.
		console.log(i+" orders: "+orders);
		console.log(" out :"+out);
		console.log(order);
		console.log(type)
        if(type[0]==2){//if an infix operator
			console.log(order+"is an operator")
			operators.push(order)
			console.log(i.toString()+order+" is an operator")
			while((operators.last()!==")")&&((prec(operators.last())>prec(order))||((prec(order)==prec(operators.last()))&&set(["→","→'"]).has(operators)))){out.push(operators.pop())}
			operators.push(order)}
        else if(order===")"){while(operators.last()!="("){out.push(operators.pop())}operators.pop()}//removes (
	     console.log(i+" operators: "+operators)
	     console.log(i+" out :"+out)
        console.log("output:"+out)
        i++}
    }
	while(operators.length){out.push(operators.pop())}//because then I delete the other object.
    return out	
}

document.getElementById("evalBtn").addEventListener("click", () => {
    //bitwise=false
    console.log(tokenise(document.getElementById("in").value))
    //console.log(shunt(tokenise(document.getElementById("in").value)))
})
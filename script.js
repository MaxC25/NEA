
//document parts
const expressionInput = document.getElementById("in");
const evalBtn = document.getElementById("evalBtn")

const prenots="!~¬"//for all that are not in square brackets, please do .split("")
//const postnots="'" commented out for being pointless but being good for documentation
const ands="&*·ϗ⁊∧∩"
const nands="|¦↑⊽"
const xors=["XOR","^","⊕"]
const ors=["||,¦¦,+,V"]
const nors=["↓","⊼","↑↑"]
const implicators=["->, →, ⇒, ⊃"]

//const tokeniser=(expr)=>{expr.search()}
/*const bIMPLY=(p,q)=>{~p|q}//in javascript, | is annoyingly or and not nand, as it should be.
const bNIMPLY=(p,q)=>{p&~q}
const bNAND=(p,q)=>{~(p&q)}
const bNOR=(p,q)=>{~(p|q)}
const lIMPLY=(p,q)=>{!p||q}
const lNIMPLY=(p,q)=>{!p||q}
const lNAND=(p,q)=>{!(p&&q)}
const lNOR=(p,q)=>{!(p||q)}*/

const tokenise=(expr)=>{
    let operands=("'+10↓⊼"+prenots+ands+nands).split("").concat(xors).concat(implicators).join("|");//reduces redundancy
    return expr.split(RegExp("(\s|?=["+operands+"])|(?<=["+operands+"])")).reverse
}

const shunt(tokens)
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

evalBtn.addEventListener("click", () => {
    console.log(tokenise(expressionInput.value))
})
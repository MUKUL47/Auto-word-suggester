module.exports.getSuffixes = function(){
    return dataPreprocess().then(data => main(data));
}

function main(data){
    return new Promise( resolve => {
        let D = new Array()
    for( let i = 0; i < data.length; i++ ){
        let splitIt = data[i].split(''), 
         head = splitIt[0],
         headPosition = checkHead(head, D),
         currentPos = 1
         /* 
         abc, abd, bcd
        1)  a    2) b
            |       |
            b       c
           / \      |
          c   d     d
          In (1) abc, abd there are 2 words 
          abc will simply stored since its empty => [a->[b->[c]]] 
            then in case of abd, head(a) will be verified if 'a' already exist
                If yes then we'll chain through a(exist)->b(exist)->d(doesn't exist create new and append to b)
                [ a -> [ b -> [ c , d ]]] 
          In (2) bcd, since there is no head 'b' to begin with            
          [ b -> [ c -> [ d ]]]  will be simply stored  
         */
        if( headPosition === -1 ){            
            let grandFather = new Character(head),
                newHead = grandFather                
                while(splitIt[currentPos]){   
                    //simply loop through characters and append to each other                         
                    let child = new Character(splitIt[currentPos++])
                    newHead.addChild(child)
                    newHead = child
                }
                D.push(grandFather)
        }else{
            let newGrandFather = D[headPosition],
                newHead = newGrandFather
            while(splitIt[currentPos]){ 
                //check if that layer of children has that same character
                let isSameChild = verifyLayer(newHead, splitIt[currentPos])
                if( isSameChild > -1 ){
                    newHead = newHead.children[isSameChild]
                    currentPos += 1
                }else{
                    //Else create new child and append to previous node
                    let child = new Character(splitIt[currentPos++])
                    newHead.addChild(child)
                    newHead = child                    
                } 
            }
            //Since old trie has been editied with 1/ more branches old one will be overwritten
            D[headPosition] = newGrandFather
        }       
    }
    resolve(D);
    })
}

function checkHead(character, D){
    for( let i = 0; i < D.length; i++ ){
        if( D[i].char === character ) return i
    }
    return -1
}

function verifyLayer(Node, character){
    for( let i = 0; i < Node.children.length; i++ ){
        if( Node.children[i].char === character ) return i
    }
    return -1
}

//Extract the data preprocess it (exclude spaces, length >= 3 etc)
function dataPreprocess(){
    return new Promise((resolve)=>{
        require('fs').readFile("words.txt",'utf-8',(err,data)=>{
            let woN = data.split('\n'), arr = new Array()
            for( let i = 0 ; i <woN.length; i++ ){
                let word = woN[i].split(' ')
                if( word.length === 1 && woN[i].trim().length !== 0) arr.push(woN[i].substring(0,woN[i].length-1).toLowerCase())
            }
            if(err) reject(err);
                    resolve(arr)
         })
    })
}

class Character{
    constructor(character){
        this.char = character
        this.children = new Array()
    }
    addChild(character){
        this.children.push(character)
    }
}


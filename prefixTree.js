(async function f(){
    let d = Date.now()
    //Extract the data preprocess it (exclude spaces, length >= 3 etc)
    let data = await new Promise((resolve)=>{
        require('fs').readFile("words.txt",'utf-8',(err,data)=>{
            let woN = data.split('\n'), arr = new Array()
            for( let i = 0 ; i <woN.length; i++ ){
                let word = woN[i].split(' ')
                if( word.length === 1 && woN[i].trim().length !== 0) arr.push(woN[i].substring(0,woN[i].length-1).toLowerCase())
            }
            resolve(arr)
         })
    })

   
    let D = new Array()

    for( let i = 0; i < data.length; i++ ){
        let splitIt = data[i].split(''), 
         head = splitIt[0],
         headPosition = checkHead(head),
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

    let word = 'su'
    console.log(guessWord(suggestWord(word),word))


function checkHead(character){
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

function randWordPicker(){
    let position = Math.floor(Math.random()*10);
        currentChar =  D[position],           
        finalString = "";
    finalString += currentChar.char;
        while(currentChar.children.length > 0){            
            let child = 
            currentChar.children[Math.floor(Math.random()*currentChar.children.length)]
            finalString += child.char
            currentChar = child  
        }
        return finalString
}


function suggestWord(prefix){
    if( prefix.length < 2 ) return []    
    var getPostion = (character, level) =>{
        if(level === undefined){
            for( let i = 0; i < D.length; i++ ){
                if( D[i].char === character ){
                    return i
                }            
            }
        }else{  
            let i = -1     
            while( ++i < level.length ){
                if( level[i].char === character ){
                    return i
                }
            }            
        }
        return -1
    }
    let i = 0,
        a = []
            let c = getPostion(prefix.charAt(i++),undefined) 
            a.push(c)    
            let currentChild = D[c].children
            while( i < prefix.length ){
                c = getPostion(prefix.charAt(i++),currentChild)
                if( c === -1 ) return []
                a.push(c)
                currentChild = currentChild[c].children                                
            }
             return a
}

function guessWord(prerequisites, prefix){
    if( prerequisites === [] ) return "No word found"
    let head = D[prerequisites[0]].children,
        i = 1;
        while( i < prerequisites.length ){
            head = head[prerequisites[i++]].children
        }
        let suffixes = new Set()

        let set = ()=>{
            let position = Math.floor(Math.random()*head.length);
         currentChar =  head[position],
         finalString = "";
         finalString += currentChar.char;
        while(currentChar.children.length > 0){            
            let child = 
            currentChar.children[Math.floor(Math.random()*currentChar.children.length)]
            finalString += child.char
            currentChar = child  
        }
        return finalString
        }


        for(let i = 0; i < 10; i++){
            suffixes.add(prefix+set())
        }


        return suffixes

}

}())

class Character{
    constructor(character){
        this.char = character
        this.children = new Array()
    }
    addChild(character){
        this.children.push(character)
    }
}


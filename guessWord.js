
var socket = io("http://localhost:3000");
socket.emit('getTrainedData');
let D;
socket.on('gotTrainedData', data => D = data );

$(document).ready( function(){
    setTimeout(() => {
        // console.log(JSON.stringify(D))
    },555)
    document.getElementById('word').onkeyup = function(){
        let word =  document.getElementById('word').value.toLowerCase()
        const wS = suggestWord(word)
        let guessedWord = guessWord(wS, word)
        if (guessedWord.length === 0 || word.length === 0) {
            $("p").html("");
        }
        $("p").html(`<h2>${guessedWord.join(', ')}</h2>`);
    }
    
    function randWordPicker() {
        let position = Math.floor(Math.random() * 10);
        currentChar = D[position],
            finalString = "";
        finalString += currentChar.char;
        while (currentChar.children.length > 0) {
            let child =
                currentChar.children[Math.floor(Math.random() * currentChar.children.length)]
            finalString += child.char
            currentChar = child
        }
        return finalString
    }
    
    
    function suggestWord(prefix) {
        if (prefix.length < 1) return []
        var getPostion = (character, level) => {
            if (level === undefined) {
                for (let i = 0; i < D.length; i++) {
                    if (D[i].char === character) {
                        return i
                    }
                }
            } else {
                let i = -1
                while (++i < level.length) {
                    if (level[i].char === character) {
                        return i
                    }
                }
            }
            return -1
        }
        let i = 0,
            a = []
        let c = getPostion(prefix.charAt(i++), undefined)
        a.push(c)
        let currentChild = D[c].children
        while (i < prefix.length) {
            c = getPostion(prefix.charAt(i++), currentChild)
            if (c === -1) return []
            a.push(c)
            currentChild = currentChild[c].children
        }
        return a
    }
    
    function guessWord(prerequisites, prefix) {
        if (prerequisites === []) return "No word found"
        else {
                let lastChild =  D[prerequisites[0]]
                let index = 1
                while(prefix.length > 1 && prefix.charAt(index) && lastChild){
                    const clonedChildren = Object.assign({},lastChild)
                    lastChild = clonedChildren['children'].filter(c => c['char'] == prefix.charAt(index))[0]
                    index++
                }
                if(!lastChild) return [];
                let visitedNodes = []
                const verticies = [...lastChild['children']];
                while(verticies.length > 0){
                const currentNode = verticies.shift()
                    currentNode['children'].forEach(node => {
                        visitedNodes.push(node.word)
                        verticies.push(node)
                    })
                } 
                return visitedNodes
        }
    
    }
})

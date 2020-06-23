
var socket = io("https://autowordsuggestor.herokuapp.com");
let D, dataGotTrained = false
socket.on('gotTrainedData', data => {
    dataGotTrained = true;
    D = data
    document.getElementById('word').onkeyup = function(){
        if(!dataGotTrained) return
        let word =  document.getElementById('word').value.trim().toLowerCase()
        let guessedWord = getAllWordsFromPrefix(suggestWord(word), word)
        if (guessedWord.length === 0 || word.length === 0) {
            document.querySelector("#words").innerHTML = ''
            document.querySelector("span").innerHTML = '0 result'
            return
        }
        document.querySelector("#words").innerHTML = `<h2>${guessedWord.join(', ')}</h2>`
        document.querySelector("span").innerHTML = `${guessedWord.length} result${guessedWord.length > 1 ? 's' : ''}`
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
    
    function getAllWordsFromPrefix(prerequisites, prefix) {
        if (prerequisites === []) return "No word found"
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
        verticies.forEach(node => {
            if(node.word.length > 1){
                visitedNodes.push(node.word)
            }
            verticies.push(node)
        })
        while(verticies.length > 0){
            const currentNode = verticies.shift()
            currentNode['children'].forEach(node => {
                if(node.word.length > 1){
                    visitedNodes.push(node.word)
                }
                verticies.push(node)
            })
        } 
        const nonDuplicates = new Set()
        visitedNodes.forEach(v => nonDuplicates.add(v.trim().toLowerCase()))
        return Array.from(nonDuplicates)
    
    }

    document.querySelector('#file').addEventListener('change',function(evt){
        var f = evt.target.files[0]; 
        if (f){
            var r = new FileReader();
              r.onload = function(e){     
                dataGotTrained = false;
                socket.emit('trainCustomData', e.target.result)
                document.querySelector("#words").innerHTML = ''
                document.querySelector("span").innerHTML = '0 result'
                document.querySelector("#word").value = ''
                document.querySelector('button').style.display = 'block'
            };
            r.readAsText(f);
        } 
    })
} );

function resetDataset(){
    socket.emit('getTrainedData');
    document.querySelector("#words").innerHTML = ''
    document.querySelector("span").innerHTML = '0 result'
    document.querySelector("#word").value = ''
    document.querySelector('button').style.display = 'done'
    document.querySelector('#file').value = ''
}
socket.emit('getTrainedData');
$(".tD").hide();

let D = JSON.parse($(".tD").text())

$('#word').keyup(function () {
    let word = $('#word').val().toLowerCase()
    let guessedWord = guessWord(suggestWord(word), word)
    if (guessedWord.length === 0 || word.length === 0) {
        $("p").html("");
    }
    $("p").html(`<h2>${guessedWord.join(', ')}</h2>`);
});




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
        try {
            let head = D[prerequisites[0]].children,
                i = 1;
            while (i < prerequisites.length) {
                head = head[prerequisites[i++]].children
            }
            let suffixes = new Set()

            let set = () => {
                let position = Math.floor(Math.random() * head.length);
                currentChar = head[position],
                    finalString = "";
                finalString += currentChar.char,
                    isNephew = false
                while (currentChar.children.length > 0 && !isNephew) {
                    let child =
                        currentChar.children[Math.floor(Math.random() * currentChar.children.length)]
                    finalString += child.char
                    currentChar = child
                    if (child.found) {
                        isNephew = !isNephew
                    }
                }
                return finalString
            }

            for (let i = 0; i < 10000; i++) {
                suffixes.add(prefix + set())
            }
            return [...suffixes]
        } catch (err) {
            return []
        }
    }

}
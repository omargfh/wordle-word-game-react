import Allowed_Words from "../../sources/allowed_words.json"

const process_guess = (guess, globalSettings, globalUIObject) => {
    
    if (guess.split("").length != globalSettings.characters) {
        
        throw "Guess not match character count."
        
    }
    else if(!Allowed_Words.words.includes(guess)) {
        
        console.log("Not a word")
        
    }
    let placeholder = globalUIObject.word.split("")
    let green_letters = [], yellow_letters = [], black_letters = []
    guess = guess.split("").map((e, i) => {
        if (placeholder[i] === e) {
            
            placeholder[i] = '$'
            green_letters.push(e)
            return `%G${e}`
            
        }
        else {
            
            return e
            
        }
    }).map(e => {
        
        if (placeholder.includes(e) && e[0] !== '%') {
            
            placeholder[placeholder.indexOf(e)] = '$'
            yellow_letters.push(e)
            return `%Y${e}`
            
        }
        else if (e[0] !== '%') {
            
            black_letters.push(e)
            return `%B${e}`
            
        }
        else {
            
            return e
            
        }
        
    }).join(",")
    
    return {
        "guess": guess,
        "black_letters": black_letters,
        "yellow_letters": yellow_letters,
        "green_letters": green_letters
    }
    
}

export default process_guess
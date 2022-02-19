import plain_game from "../../sources/plain_game"


const update_globalUI = (prev, curr, globalSettings, setGlobalUIObject) => {
    
    // Initiate the game, re-run the game
    if (prev.word === "" || prev.guesses.length == globalSettings.limit) {
        
        if (curr.word !== "") {
            
            setGlobalUIObject({...plain_game, word:curr.word})
            
        }
        else {
            
            console.warn("Attempt to initiate an empty word.")
            
        }
        
    }
    // updating a guess
    else if (curr.guesses.length > prev.guesses.length) {
        
        if (curr.guesses.length - prev.guesses.length !== 1) {
            
            console.warn("More than one guess pushed to UI.")
            
        }
        else if (prev.word !== curr.word) {
            
            console.warn("Guess word abruptly changed.")
            
        }
        else if (curr.guesses > globalSettings.limit) {
            
            console.warn("Guesses exceeds global settings limit.")
            
        }
        else {
            
            setGlobalUIObject({...curr, input_line: ""})
            
        }
        
    }
    // Update input line
    else if (curr.input_line.split("").length - prev.input_line.split("").length  === 1 ||
    prev.input_line.split("").length - curr.input_line.split("").length  === 1) {
        
        setGlobalUIObject({...prev, input_line: curr.input_line})
        
    } 
    
}

export default update_globalUI
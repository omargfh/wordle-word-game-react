import process_guess from "./process_guess"

const push_guess = (globalUIObject, update_globalUI_object, globalSettings, guess) => {
    
    const p_guess = process_guess(guess, globalSettings, globalUIObject) 
    
    const black_letters = new Set(JSON.parse(JSON.stringify([...globalUIObject.black_letters])))
    p_guess.black_letters.forEach(e => {
        black_letters.add(e)
    })
    
    const green_letters = new Set(JSON.parse(JSON.stringify([...globalUIObject.green_letters])))
    p_guess.green_letters.forEach(e => {
        green_letters.add(e)
    })
    
    const yellow_letters = new Set(JSON.parse(JSON.stringify([...globalUIObject.yellow_letters])))
    p_guess.yellow_letters.forEach(e => {
        yellow_letters.add(e)
    })
    
    // Avoid black letters that result from duplication of 
    // letters in a word
    black_letters.forEach((e => {
        if (yellow_letters.has(e) || green_letters.has(e)) {
            black_letters.delete(e)
        }
    }))
    
    // Avoid letters that were previously yellow but are now green
    yellow_letters.forEach((e => {
        if (green_letters.has(e)) {
            yellow_letters.delete(e)
        }
    }))
    
    update_globalUI_object(globalUIObject, {...globalUIObject,
        guesses: [...globalUIObject.guesses, p_guess.guess],
        plain_guesses: [...globalUIObject.plain_guesses, guess],
        black_letters: black_letters,
        green_letters: green_letters,
        yellow_letters: yellow_letters
    })
}

export default push_guess
const render_guess = guess => {
    
    let row = []
    guess.split(",").forEach(char => {
        
        let parse = char.match('%([A-Z])([a-z])')
        let flag  = parse[1] === "B" ? "black"
        : parse[1] === "G" ? "green"
        : "yellow"
        let letter = parse[2]
        
        row.push(<div className={`wordle-space ${flag} animate`}>{letter.toUpperCase()}</div>)
        
    })
    
    return row
    
}

const render_guessCanvas = (globalUIObject, globalSettings, inputLineRef) => {
    
    let g_count = globalUIObject.guesses.length
    let rows = []
    
    // Already guessed
    globalUIObject.guesses.forEach(guess => {
        rows.push(<div className='wordle-row'>{render_guess(guess)}</div>)
    })
    
    // Input line
    if (g_count !== 6) {
        let row = []
        for(let j = 0; j < globalSettings.characters; j++) {
            if (j < globalUIObject.input_line.split("").length) {
                row.push(<div className='wordle-space input hasinput pulse'>{globalUIObject.input_line[j].toUpperCase()}</div>)
            }
            else {
                row.push(<div className='wordle-space input'></div>)
            }
        }
        rows.push(<div className='wordle-row' ref={inputLineRef}>{row}</div>)
    }
    
    // Rest
    for (let i = 1; i < globalSettings.limit - g_count; i++) {
        let row = []
        for(let j = 0; j < globalSettings.characters; j++) {
            row.push(<div className='wordle-space blank'></div>)
        }
        rows.push(<div className='wordle-row'>{row}</div>)
    }
    
    return <div className='wordle-canvas'>{rows}</div>
    
}

export default render_guessCanvas
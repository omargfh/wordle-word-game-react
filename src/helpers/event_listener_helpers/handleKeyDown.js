const press_key = (key, keyboardRef) => {
    const keyboard = ["qwertyuiop", "asdfghjkl", "↩zxcvbnm⌫"]
    const index_s  = keyboard.reduce((p, c, i, a) => {
        if (c.includes(key)) {
            return p - (a.length - i - 1)
        }
        else {
            return p + 1
        }
    }, 0)
    
    keyboardRef.current.children[index_s].children[keyboard[index_s].indexOf(key)].click()
}

const handleKeyDown = (e, enter_guess, bspace, keyboardRef) => {
    if(/^[A-Z]$/i.test(e.key)) {
        press_key(e.key, keyboardRef)
    }
    else if (e.key === 'Enter') {
        enter_guess.current.click()
    }
    else if (e.key === 'Backspace') {
        bspace.current.click()
    }
}

export default handleKeyDown
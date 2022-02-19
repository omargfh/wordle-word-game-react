import './App.css';
import { useState, useEffect, useRef } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


import Allowed_Words from './sources/allowed_words.json'
import Possible_Words from './sources/possible_words.json'

import plain_game from './sources/plain_game'
import Header from './components/header'

import { Dev } from './components/dev'

function App() {

  const [globalSettings, setGlobalSettings] = useState({
    limit: 6,
    characters: 5
  })

  const [globalUIObject, setGlobalUIObject] = useState(plain_game)

  const update_globalUI_object = (prev, curr) => {

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

  // First cycle: begin the game
  const select_random_word = () => Possible_Words.words[Math.floor(Math.random() * Possible_Words.words.length)]
  const initiate_game = globalUIObject => {
    update_globalUI_object(globalUIObject, {...globalUIObject, word: select_random_word()})
  }
  

  // Second cycle: make a guess
  const process_guess = guess => {

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

  const push_guess = (globalUIObject, guess) => {

    const p_guess = process_guess(guess) 

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

  // Third cycle: win/loss, score tracking, re-runs, round management
  const [score, setScore] = useState(0)
  const check_cycle = globalUIObject => {

    // If the new guess is the actual word, execute win routine
    if (globalUIObject.plain_guesses[globalUIObject.plain_guesses.length - 1] === globalUIObject.word) {
      setScore(score + 1)
      prompt_msg(promptRef, "That's correct!")
      initiate_game(plain_game)
    }
    // If the limit is reached without right guesses, execute loss routine
    else if (globalUIObject.guesses.length === 6) {
      // TODO: prompt loss
      prompt_msg(promptRef, `You Lost. The word was: ${globalUIObject.word.charAt(0).toUpperCase() + globalUIObject.word.slice(1)}`)
      reset()
    } 
  }
  
  // Render methods

  // Render keyboard
  const [keyboardUI, setKeyboardUI] = useState(<></>)
  const mapKey = (key) => {
    if (globalUIObject.input_line.split("").length < globalSettings.characters) {
      update_globalUI_object(globalUIObject, {...globalUIObject, input_line: `${globalUIObject.input_line}${key}`})
    }
  }
  const keyboardRef = useRef(null)
  const render_keyboard = (globalUIObject) => {
    const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
    let rows = []
    keyboard.map(e => e.split("")).forEach((e, i) => {
      let row = []

      if (i === 2) {
        row.push(<div className='keyboard-key enter' onClick={e => enter(e)} ref={enter_guess} key={"enter"}>⏎</div>)
      }

      e.forEach(key => {


        let flag = ""
        if (globalUIObject.black_letters.has(key)) {
          flag = "key-black"
        }
        else if (globalUIObject.green_letters.has(key)) {
          flag = "key-green"
        }
        else if (globalUIObject.yellow_letters.has(key)) {
          flag = "key-yellow"
        }

        row.push(<div className={`keyboard-key ${flag}`}
        onClick={() => {
          mapKey(key)
        }} key={key}>{key.toUpperCase()}</div>)
      })

      if (i === 2) {
        row.push(<div className='keyboard-key backspace' onClick={(e) => remove_letter(e)} ref={bspace} key={"backspace"}>⌫</div>)
      }

      rows.push(<div className='keyboard-row' key={rows.length}>{row}</div>)
    })

    setKeyboardUI(<div className='keyboard' key={"keyboard"} ref={keyboardRef}>{rows}</div>)

  }

  // Render the gameplay canvas
  const [guessCanvasUI, setGuessCanvasUI] = useState(<></>)
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
  const render_guessCanvas = globalUIObject => {
    

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

    setGuessCanvasUI(<div className='wordle-canvas'>{rows}</div>)

  }

  // Handle keypresses, document load, effectful changes
  // and propagation

  const enter_guess = useRef(null)
  const bspace = useRef(null)
  const press_key = (key) => {
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

  const handleKeyDown = (e) => {
    if(/^[A-Z]$/i.test(e.key)) {
      press_key(e.key)
    }
    else if (e.key === 'Enter') {
      enter_guess.current.click()
    }
    else if (e.key === 'Backspace') {
      bspace.current.click()
    }
  }

  useEffect(() => {
    if (localStorage.getItem("wordle-game-session") !== null) {
      let pre_parse = JSON.parse(localStorage.getItem("wordle-game-session"))
      setGlobalUIObject({...pre_parse, 
        black_letters: new Set(pre_parse.black_letters),
        green_letters: new Set(pre_parse.green_letters),
        yellow_letters: new Set(pre_parse.yellow_letters)
      })

      const _score = JSON.parse(localStorage.getItem("wordle-game-score"))
      if (/^[0-9]$/i.test(_score)) {
        setScore(parseInt(_score))
      }
      else {
        setScore(0)
      }
    }
    else {
      initiate_game(globalUIObject)
    }
    render_keyboard(globalUIObject)
    document.addEventListener("keydown", handleKeyDown)
    
    return function cleanup () {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  
  useEffect(() => {
    setTimeout(() => {
      check_cycle(globalUIObject)
    }, 1500);
    render_keyboard(globalUIObject)
    render_guessCanvas(globalUIObject)
    localStorage.setItem("wordle-game-session", JSON.stringify({...globalUIObject,
      black_letters:[...globalUIObject.black_letters],
      green_letters:[...globalUIObject.green_letters],
      yellow_letters:[...globalUIObject.yellow_letters],
    }))
    localStorage.setItem("wordle-game-score", JSON.stringify(score))
  }, [globalUIObject])

  // More GUI-specific functionalities, animation,
  // and special button presses
  const reset = () => {
    setScore(0)
    initiate_game(plain_game)
  }

  const remove_letter = (e) => {
    e.preventDefault();
    update_globalUI_object(globalUIObject, {...globalUIObject, input_line:globalUIObject.input_line.substring(0, globalUIObject.input_line.length - 1)})
  }

  const enter = (e) => {
    e.preventDefault();
    if (globalUIObject.input_line.split("").length === globalSettings.characters && Allowed_Words.words.includes(globalUIObject.input_line)) {
      push_guess(globalUIObject, globalUIObject.input_line)
    }
    else {
      shakeUI(inputLineRef)
      prompt_msg (promptRef, "Not a word!")
    }
  }

  const inputLineRef = useRef(null)
  const shakeUI = ref => {
    ref.current.classList.add("shake")
    setTimeout(() => {
      ref.current.classList.remove("shake")
    }, 1500)
  }

  const promptRef = useRef(null)
  const prompt_msg = (ref, msg) => {
    console.log(ref.current.children[0].innerText)
    ref.current.children[0].innerText = msg
    ref.current.classList.remove("hidden")
    ref.current.classList.add("fade-in")
    setTimeout(() => {
      ref.current.classList.add("fade-out")
      ref.current.classList.remove("fade-in")
    }, 1000)
    setTimeout(() => {
      ref.current.classList.add("hidden")
      ref.current.classList.remove("fade-out")
      // ref.current.children[0].innerText = ""
    }, 2000)
  }

  return (
    <Router>

    <Header reset={reset}/>

    <Routes>
      <Route exact path="/" element={
        <div className='canvas'>
          <div className='prompt-msg hidden' ref={promptRef}>
            <h3>Not a word!</h3>
        </div>
        <div className='score'>
          <h4 style={{"textAlign": "center"}}>Score: {score}</h4>
        </div>
          {guessCanvasUI}
          {keyboardUI}
        </div>
      } />
      <Route exact path="/dev" element={<Dev />}/>
    </Routes>
    </Router>
  );
}

export default App;

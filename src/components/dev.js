import { useState, useEffect, useRef } from 'react'

import Allowed_Words from '../sources/allowed_words.json'
import Possible_Words from '../sources/possible_words.json'
import Permutations from '../sources/permutations.json'

const get_matches = (words, guess, clues) => {
    
    const get_regex = (guess, clues, add_to_possible_letters) => {
        let re = "^"
        clues.split("").forEach((e, i) => {
            if (e.toUpperCase() === "B") {
                re += `([^${guess[i]}]){1}`
            }
            else if (e.toUpperCase() === "G") {
                re += `(${guess[i]}){1}`
            }
            else {
                add_to_possible_letters(guess[i]) /* Side-effect */
                re += `([a-z]){1}`
            }
        });
        return new RegExp(re, 'g')
    }
    
    let possible_letters = []
    const add_to_possible_letters = (l) => {
        possible_letters.push(l)
    }
    
    const re = get_regex(guess, clues, add_to_possible_letters)
    
    let matches = []
    words.forEach((word, i) => {
        if(re.test(word)) {
            let letter_pool = [...possible_letters]
            word.split("").forEach(letter => {
                const index = letter_pool.indexOf(letter)
                if (index > -1) {
                    letter_pool.splice(index, 1)
                }
            })
            if (letter_pool.length === 0) {
                matches.push(word)
            }
        }
    })
    
    return matches  
}

const get_probability = (words, guess, clues) => get_matches(words, guess, clues).length / Possible_Words.words.length

const get_information = (words, guess, clues) => {
    const p = get_probability(words, guess, clues)
    if (p === 0) {
        return 0
    }
    return p * Math.log(Math.pow(p, -1))
}

const compute_entropy = (words, guess) => {
    
    let entropy = 0
    Permutations.permts.forEach(e => {

        const bits = get_information(words, guess, e)
        entropy +=  isFinite(bits) ? bits : 0

    })
    return entropy

}

const compute_all_entropy = (words) => {

    let entropies = []
    words.forEach(word => {
        entropies.push({
            "word": word,
            "entropy": compute_entropy(words, word)
        })
    }).sort((a, b) => {
        const res = a.entropy === b.entropy ? 0 
                  : a.entropy > b.entropy ? -1
                  : 1
    })

}

const Dev = () => {
    
    useEffect(() => {
        get_matches(Possible_Words.words, "crane", "BBGYB")
        console.log(get_information(Possible_Words.words, "crane", "BBBBB"))
        console.log(compute_entropy(Possible_Words.words, "dopey"))
        return () => {
        }
    }, [])
    
    
    return (
        <div>Dev</div>
        )
    }
    
    export {Dev, get_matches, get_information, compute_entropy}
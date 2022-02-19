const Allowed_Words = require('../sources/allowed_words.json')
const Possible_Words = require('../sources/possible_words.json')
const Permutations = require('../sources/permutations.json')
const Entropies = require('./entropies.json')

const fs = require('fs')
const WORDLEN = 5

const combine = (obj0, obj1) => {
    
    let b = new Set([...obj0.b, ...obj1.b])
    let g = [...obj0.g, ...obj1.g]
    let y = new Set([...obj0.y, ...obj1.y])
    
    let g_stripped = g.map(e => e.l)
    
    y.forEach(e => {
        if (g_stripped.includes(e)) {
            y.delete(e)
        }
    })
    y = [...y]
    
    b.forEach(e => {
        if (g_stripped.includes(e) || y.includes(e)) {
            b.delete(e)
        }
    })
    b = [...b]
    
    const obj = {
        "b": b,
        "b_i": [...obj0.b_i, ...obj1.b_i].reduce((r, i) => 
        !r.some(j => JSON.stringify(i) === JSON.stringify(j)) ? [...r, i] : r
        , []),
        "g": g,
        "y": y
    }
    return {
        "re": get_regex(obj),
        "clues_object": obj
    }
}

const get_regex = (obj) => {
    let exp = obj.b.reduce((p, c) => {
        return p + c
    }, "[^") + "]%"
    exp = exp.repeat(5).split('%')
    
    obj.g.forEach(e => {
        exp[e.i] = e.l
    })
    
    obj.b_i.forEach(e => {
        if (!obj.b.includes(e.l)) {
            if(obj.y.includes(e.l)) {
                if (exp[e.i][0] === '[') {
                    exp[e.i] = exp[e.i].substring(0, 2) + e.l + exp[e.i].substring(2, exp[e.i].length)
                }
            }
            
            if(obj.g.map(e => e.l).includes(e.l) && obj.g[obj.g.map(e => e.l).indexOf(e.l)].i !== e.i) {
                exp = exp.map(ex => {
                    if (ex[0] === '[') {
                        return ex.substring(0, 2) + e.l + ex.substring(2, ex.length)
                    }
                    else {
                        return ex
                    }})
                }
            }
        })
        
        return new RegExp(`^${exp.join("")}`, 'g')
    }
    
    
    const get_matching_data = (g, c) => {
        
        let clues_object = {
            "b": [],
            "b_i": [],
            "g": [],
            "y": []
        }
        
        c.split("").forEach((e, i) => {
            if (e.toUpperCase() === "B") {
                if (!clues_object.b.includes(g[i])) {
                    clues_object.b_i.push({
                        "l": g[i],
                        "i": i 
                    })
                }
            }
            else if (e.toUpperCase() === "G") {
                clues_object.g.push({
                    "l": g[i],
                    "i": i 
                })
            }
            else {
                clues_object.y.push(g[i])
            }
        });
        
        clues_object.b = clues_object.b_i.map(e => e.l).filter(n => !clues_object.y.includes(n))
        
        return {
            "re": get_regex(clues_object),
            "clues_object": clues_object
        }
        
    }
    
    
    const get_matches_primitive = (p, g, re, possible_letters) => {
        
        let matches = []
        for(let i = 0; i < p.length; i++) { // words.forEach(word => {})
            const word = p[i] 
            if(word.match(re)) {
                let letter_pool = [...possible_letters]
                for (let i = 0; i < WORDLEN; i++) {
                    const index = letter_pool.indexOf(word[i])
                    if (index > -1) {
                        letter_pool.splice(index, 1)
                    }
                }
                if (letter_pool.length === 0) {
                    matches.push(word)
                }
            }
        }
        
        return matches
    }
    
    const get_matches = (p, g, c) => {
        const x = get_matching_data(g, c)
        return get_matches_primitive(p, g, x.re, x.clues_object.y)
    }
    
    const get_probability = (p, g, c) =>  get_matches(p, g, c).length / p.length
    
    const get_information = (p, g, c) => {
        const p_x = get_probability(p, g, c)
        return p_x * Math.log(Math.pow(p_x, -1))
    }
    
    const compute_entropy = (p, g) => {
        
        let entropy = 0
        Permutations.permts.forEach(e => {
            const bits = get_information(p, g, e)
            entropy +=  isFinite(bits) ? bits : 0
            
        })
        return entropy
        
    }
    
    const compute_all_entropy = (w, p) => {
        
        let entropies = []
        w.forEach(word => {
            const entropy = compute_entropy(p, word)
            entropies.push({
                "word": word,
                "entropy": entropy
            })
        })
        return entropies
        
    }

    const sort_entropies = l => l.sort((a, b) => {
        const res = a.entropy === b.entropy ? 0 
        : a.entropy > b.entropy ? -1
        : 1
        return res
    })
    
    
    var startTime = performance.now()

    const first = ["rarer", "YBBBB"]
    const second = ["trust", "BGBBB"]
    const third = ["drool", "GGBBG"]
    const fourth = ["bench", "BGYBG"]

    console.log(sort_entropies(compute_all_entropy(Allowed_Words.words, Possible_Words.words))[0])


    
    const x = get_matching_data(first[0], first[1])
    // console.log(x)
    const y = get_matches_primitive(Possible_Words.words, first[0], x.re, x.clues_object.y)
    // console.log(sort_entropies(compute_all_entropy(y, y))[0])
    const xn = get_matching_data(second[0], second[1])
    const x0 = combine(x.clues_object, xn.clues_object)
    const z = get_matches_primitive(y, second[0], x0.re, x0.clues_object.y)
    // console.log(sort_entropies(compute_all_entropy(z, z))[0])
    const xn1 = get_matching_data(third[0], third[1])
    const x1 = combine(x0.clues_object, xn1.clues_object)
    // const z2 = get_matches_primitive(z, third[0], x1.re, x1.clues_object.y)
    console.log(sort_entropies(compute_all_entropy(z2, z2))[0])
    const xn2 = get_matching_data(fourth[0], fourth[1])
    const x2 = combine(x1.clues_object, xn2.clues_object)
    const z3 = get_matches_primitive(z2, fourth[0], x2.re, x2.clues_object.y)
    // console.log(sort_entropies(compute_all_entropy(z3, z3))[0])
    
    var endTime = performance.now()
    
    
    console.log(`Call to doSomething took ${(endTime - startTime) / 1000 }`)
    
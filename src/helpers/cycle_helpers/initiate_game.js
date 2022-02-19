import Possible_Words from "../../sources/possible_words.json"

const select_random_word = () => Possible_Words.words[Math.floor(Math.random() * Possible_Words.words.length)]
const initiate_game = (globalUIObject, update_globalUI_object) => {
    update_globalUI_object(globalUIObject, {...globalUIObject, word: select_random_word()})
}

export default initiate_game
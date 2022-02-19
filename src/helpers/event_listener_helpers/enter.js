import shakeUI from "../ui_helpers/shakeUI"
import prompt_msg from "../ui_helpers/prompt_msg"
import Allowed_Words from "../../sources/allowed_words.json"

const enter = (e, globalUIObject, update_globalUI_object, push_guess, globalSettings, inputLineRef, promptRef) => {
    e.preventDefault();
    if (globalUIObject.input_line.split("").length === globalSettings.characters && Allowed_Words.words.includes(globalUIObject.input_line)) {
        push_guess(globalUIObject.input_line)
    }
    else {
        shakeUI(inputLineRef)
        prompt_msg (promptRef, "Not a word!")
    }
}

export default enter
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


export default prompt_msg
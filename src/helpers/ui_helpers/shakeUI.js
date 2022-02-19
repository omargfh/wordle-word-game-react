const shakeUI = ref => {
    ref.current.classList.add("shake")
    setTimeout(() => {
      ref.current.classList.remove("shake")
    }, 1500)
}

export default shakeUI
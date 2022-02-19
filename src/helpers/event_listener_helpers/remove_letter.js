import React from 'react'

const remove_letter = (e, globalUIObject) => {
    e.preventDefault();
    return {...globalUIObject, input_line:globalUIObject.input_line.substring(0, globalUIObject.input_line.length - 1)}
}


export default remove_letter
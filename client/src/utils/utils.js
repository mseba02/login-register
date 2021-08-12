// check for mail validation
export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// update target value
export const updateIndexVal = (array, e, index) => {
    array[index].value = e.target.value;
}

// update input errors
export const updateError = (array, index, e, digits) => {
    if(e.target.value.length >= digits) {
        array[index].error = ''
    } else {
        array[index].error = `enter at least ${digits} digits`
    }
}
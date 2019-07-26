const updateuser = (user) => {
    return {
        type : 'UPDATE_USER',
        user
    }
}

const removeUser = () => {
    return {
        type : 'REMOVE_USER',
        user : null
    }
}

export {
    updateuser,
    removeUser
}
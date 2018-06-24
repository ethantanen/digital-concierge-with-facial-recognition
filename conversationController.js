
function greet(id) {
  console.log("Greetings!", id)
}

function newUser(id) {
  console.log("New User!", id)
}

module.exports = {
  greet: greet,
  newUser: newUser,
}

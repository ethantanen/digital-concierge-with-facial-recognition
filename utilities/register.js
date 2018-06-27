
// Object of conversations with callword as key
conversations = {}


// Conversation object
conversation = {
  questions: [],
  answers: {},
  index: 0,
  end: false,
  next: function() {
    if(this.index == this.questions.length || this.end == true) {
      this.end = true
      return undefined
    }
    question = this.questions[this.index]
    this.index += 1
    return question[0]
  },
  answer: function(value) {
    if(value) this.answers[this.questions[this.index-1][1]] = value
  },
  summary: function() {}
}

// Add conversation to the list of available conversations
function addConversation(callword,questions,summary) {

  // create conversation object
  c = conversation
  c.questions = questions
  c.summary = summary

  // add object to conversation list
  conversations[callword] = c
}

module.exports = {
  addConversation:addConversation,
  conversations: conversations,
}


// Conversation object
conversation = {
  questions: [],
  answers: {},
  index: 0,
  end: false,
  next: function() {
    if(this.index == this.questions.length-1 || this.end == true) {
      this.end = true
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

// Conversation manager object
conversationManager = {
  conversations: {},
  add: function(callword, questions, summary){
    this.conversations[callword]           = Object.assign({},conversation)
    this.conversations[callword].questions = questions
    this.conversations[callword].summary   = summary

  }
}

// Returns the conversation manager
function getConversations(){
  return conversationManager
}

module.exports = {
  conversationManager : conversationManager,
  getConversations: getConversations,
}

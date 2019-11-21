class FlashError extends Error {
  constructor(message){
    this.message = message;
  }
}

module.exports = FlashError;
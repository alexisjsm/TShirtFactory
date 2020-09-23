class ErrorHandle extends Error {
  constructor (statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res, next) => {
  const { statusCode, message, code, keyValue } = err
  if (statusCode) {
    return res.status(statusCode).json({
      status: 'error',
      statusCode,
      message
    })
  }
  switch (code) {
    case 11000:
      return res.status(409).json({
        status: 'error',
        statusCode: 409,
        message: 'duplicate key error collection',
        keyValue
      })
      break
  }
  next()
}

export {
  ErrorHandle,
  handleError
}

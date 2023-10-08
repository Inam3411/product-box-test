

const sendUniqueConstraintError = (err,res)=>{

  // console.log()
  const errorMessage = err.errors[0].message

  // console.log(err)
  return res.status(409).json({
    status: err.status,
    message: errorMessage
  });
}
const sendValidationError = (err,res)=>{

  const errorMessage = `Please provide a valid value for ${err.errors[0].path}.`

  return res.status(400).json({
    status: err.status,
    message: errorMessage
  });
}

const sendError = (err, req, res) => {
  
    if (err.isOperational) {
      return res.status(400).json({
        status: err.status,
        message: err.message
      });
    }
    
    if(err.name==='SequelizeUniqueConstraintError'){
      return sendUniqueConstraintError(err, res)
    }
    if(err.name==='SequelizeValidationError'){
      return sendValidationError(err, res)
    }

    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendError(err, req, res);
};

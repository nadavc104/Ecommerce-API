import { logEvents } from '../middlewares/logger.js'

const validation = (bodyValidator, paramsValidator)  => (req, res, next) => {

    if(bodyValidator) {
        const { error: errorBody } = bodyValidator(req.body)

        if(errorBody) {
            logEvents(`${errorBody.name}: ${errorBody.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
            const messages = errorBody.details.map((detail) => detail.message)
            return res.status(400).json({message: messages})
        }
    }
   
    if(paramsValidator) {
        const { error: paramsError } = paramsValidator(req.params)

        if(paramsError) {
            logEvents(`${paramsError.name}: ${paramsError.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
            const messages = paramsError.details.map((detail) => detail.message)
            return res.status(400).json({message: messages})
        }
    }

    next()
}

export { validation }




// import { logEvents } from '../middlewares/logger.js'

// const validation = (validator) => (req, res, next) => {
//     console.log(req.body)
//     console.log(validator(req.body))
//     const { error }  = validator(req.body)
//     console.log('bodyerror is', error)
//     const { error: paramsError } = validator(req.params)
//     console.log('paramsError is', paramsError)


//     if(error) {
//         logEvents(`${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
//         const messages = error.details.map((detail) => detail.message)
//         return res.status(400).json({message: messages})
//     }

//     if(paramsError) {
//         logEvents(`${paramsError.name}: ${paramsError.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
//         const messages = paramsError.details.map((detail) => detail.message)
//         return res.status(400).json({message: messages})
//     }
//     next()
// }

// export { validation }
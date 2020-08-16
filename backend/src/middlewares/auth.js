const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authHeader = request.headers.authorization

  if(!authHeader)
    return response.status(401).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if(! (parts.length === 2))
    return response.status(401).send({ error: 'Token error' })

  console.log(parts.length === '2')

  const [ scheme, token ] = parts

  if(!/^Bearer$/i.test(scheme))
    return response.status(401).send({ error: 'Token malformatted' })

  jwt.verify(token, process.env.BOXSO_SECRET, (err, decoded) => {
    if(err) return response.status(401).send({ error: 'Token invalid' })

    request.uuid = decoded.uuid
    return next()
  })

}

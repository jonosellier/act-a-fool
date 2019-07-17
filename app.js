const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

app.use(express.static('www'))

app.get('/', (req, res) => res.sendfile('./www/index.html'))

app.listen(port, () => console.log(`App listening on port ${port}!`))

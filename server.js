import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { getPrice } from './utils/getPrice.js'
import { getContentType } from './utils/getContentType.js'

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

  if (req.url === '/utils/getPrice.js') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
      })

     setInterval(() => {
      const newPrice = getPrice()
      res.write(`data: ${JSON.stringify({ price: newPrice })}\n\n`)

    }, 2000)
  } else {
    await serveStatic(req, res, __dirname)
  }
    
  });



  server.listen(PORT, ()=> console.log(`Connected on port: ${PORT}`))
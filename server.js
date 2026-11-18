import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs/promises'

import { serveStatic } from './utils/serveStatic.js'
import { getPrice } from './utils/getPrice.js'

const PORT = 8000
const __dirname = import.meta.dirname

async function handlePurchase(req, res) {
    try {
        // 1. Receive data sent by the browser
        let body = ''

        for await (const chunk of req) {
            body += chunk

            if (body.length > 10000) {
                res.writeHead(413)
                return res.end('Request too large')
            }
        }

        const { amount } = JSON.parse(body)

        // 2. Validate the investment
        if (
            typeof amount !== 'number' ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > 1000000
        ) {
            res.writeHead(400)
            return res.end('Invalid investment amount')
        }

        // 3. Calculate purchase on the server
        const price = getPrice()
        const ounces = amount / price

        // 4. Prepare a line for our log
        const log = `${new Date().toISOString()}, amount paid: £${amount.toFixed(2)}, price per Oz: £${price.toFixed(2)}, gold sold: ${ounces.toFixed(4)} Oz\n`

        // 5. Create the data folder if necessary
        const dataDir = path.join(__dirname, 'data')
        await fs.mkdir(dataDir, { recursive: true })

        // 6. Append purchase to the file
        const filePath = path.join(dataDir, 'purchases.txt')
        await fs.appendFile(filePath, log)

        // 7. Send confirmation to the browser
        res.writeHead(201, {
            'Content-Type': 'application/json'
        })

        res.end(JSON.stringify({
            amount,
            price,
            ounces
        }))

    } catch (error) {
        console.error('Purchase error:', error)

        if (error instanceof SyntaxError) {
            res.writeHead(400)
            return res.end('Invalid JSON')
        }

        res.writeHead(500)
        res.end('Could not save purchase')
    }
}

const server = http.createServer(async (req, res) => {

    if (req.method === 'POST' && req.url === '/purchase') {
        await handlePurchase(req, res)

    } else if (req.url === '/utils/getPrice.js') {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        })

        const interval = setInterval(() => {
            const newPrice = getPrice()
            res.write(`data: ${JSON.stringify({ price: newPrice })}\n\n`)
        }, 2000)

        req.on('close', () => clearInterval(interval))

    } else {
        await serveStatic(req, res, __dirname)
    }
})

server.listen(PORT, () => {
    console.log(`Connected on port: ${PORT}`)
})
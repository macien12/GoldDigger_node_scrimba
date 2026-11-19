# GoldDigger

I built GoldDigger as a Scrimba project to learn how a browser and a Node.js server work together. The app streams a simulated gold price and lets you enter an amount in pounds to see how many troy ounces it would buy.

## What I learned

- **Serving files with Node.js.** I used `node:http` to route requests and `node:fs/promises` to read files from `public/`. Serving HTML, CSS, JavaScript, and images helped me see why the browser needs the right `Content-Type` header and how to return a custom `404` page.
- **Streaming updates with Server-Sent Events.** I kept an HTTP response open and sent a new simulated price every two seconds. The browser received the updates through `EventSource`, and I learned to clear the server's timer when the client disconnected.
- **Sending and validating a JSON request.** I used `fetch()` to send the investment amount to `POST /purchase`, then read the request body in chunks and validated the amount on the server. The browser can catch simple input mistakes early, and the server still has to check what it receives.
- **Moving the purchase calculation to the server.** I first calculated the ounces in the browser using the displayed price. Moving the calculation to the server taught me to send just the amount and let the server use its own price to calculate how many ounces to return.
- **Saving a purchase before confirming it.** I used `fs.appendFile()` to add a timestamped entry to `data/purchases.txt`. The server sends its confirmation after the write succeeds, and the browser uses that response to show the purchase summary in an HTML `<dialog>`.

## Run locally

Use Node.js 22.16+ and run this from the project folder. The project uses built-in Node.js modules and has no npm dependencies. [Node.js ES module documentation](https://nodejs.org/api/esm.html#importmetadirname)

```sh
npm start
```

Open [http://localhost:8000](http://localhost:8000), wait for the first price update, then enter an amount and click **Invest Now!** to try a simulated purchase.

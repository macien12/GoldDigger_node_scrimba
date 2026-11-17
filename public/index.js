const eventSource = new EventSource('./utils/getPrice.js')

const getPrice = document.getElementById("price-display")


eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const price = data.price

  getPrice.textContent = price
}

eventSource.onerror = () => {
  console.log('Connection failed...')
}
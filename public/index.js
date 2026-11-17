const eventSource = new EventSource('./utils/getPrice.js')

const getPrice = document.getElementById("price-display")
const invAmount = document.getElementById("investment-amount")
const outputDialog = document.getElementById("output-Dialog")
const investBtn = document.getElementById("invest-btn")
const closeBtn = document.getElementById("close-btn")
const ounceQnt = document.getElementById("Ounce-Qnt")
const moneySpent = document.getElementById("money-Spent")
const boughtFor = document.getElementById("bought-For")


eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const price = data.price

  getPrice.textContent = price
}

eventSource.onerror = () => {
  console.log('Connection failed...')
}

investBtn.addEventListener("click", function(e) {
 e.preventDefault()
 calculateInvestment()
 outputDialog.showModal()
 
})


closeBtn.addEventListener("click", function(e) {
 e.preventDefault()
 outputDialog.close()
})

function calculateInvestment(money) {

  const price = parseFloat(getPrice.textContent)
  const amount = parseFloat(invAmount.value)
  
  const finalOunces = amount / price
  
  ounceQnt.textContent = finalOunces.toFixed(4)
  boughtFor.textContent = amount

}
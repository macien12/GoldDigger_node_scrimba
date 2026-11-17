let price = 2129.23

export function getPrice(min = -1000, max = 5000) {
  const change = Math.random() < 0.5 ? -1 : 1
  price += change

  // Clamp the value within min and max
  price = Math.max(min, Math.min(max, price))

  return price
}
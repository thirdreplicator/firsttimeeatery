import { persistentAtom } from "@nanostores/persistent";

export const shoppingCartStore = persistentAtom("shoppingCartStore", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const QUANTITY_INDEX = 1
export const PRICE_INDEX = 2

shoppingCartStore.increment = (productId, optionIds, computedPrice) => {
  const newKey = JSON.stringify([productId].concat(optionIds.sort()))
  let cart = shoppingCartStore.get()

  // Find out if it's  already in the cart.
  let i = -1
  cart.forEach((row, j) => {
    let [key, qty] = row
    if (key == newKey) {
      i =  j
    }
  });

  // Update or append the cart depending on whether it was found or not.
  if (i > -1) {
    //  Key was found
    cart[i][QUANTITY_INDEX] += 1
  } else {
    // Key was not found, so simply append a new row of [key, quantity] to the cart.
    cart.push([newKey, 1,  computedPrice])
  }
  //  Persist it
  shoppingCartStore.set(cart)
}

export const computePrice = (basePrice, selectedOption, onlineFactor) => parseInt(Math.floor(Math.round(onlineFactor * (basePrice + (selectedOption ? selectedOption.price_modifier  : 0)))))

export const total = (cart) => {
  return cart.map(line => line[QUANTITY_INDEX] * line[PRICE_INDEX])
   .reduce((sum, x) => sum + x, 0)
}

export const parseLineItem = (lineItem) => {
  // The line item key is a compound key created by stringifying [productId, optionIds.sort()].
  let [lineKey, quantity, price]  = lineItem
  let ids = JSON.parse(lineKey)
  let [productId, ...optionIds] = ids
  return [lineKey, productId, optionIds, quantity, price]
}

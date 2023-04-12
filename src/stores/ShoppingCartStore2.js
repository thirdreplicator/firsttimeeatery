import { persistentAtom } from "@nanostores/persistent";

export const shoppingCartStore = persistentAtom("shoppingCartStore", {data: [], updatedAt: 0}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const QUANTITY_INDEX = 1
export const PRICE_INDEX = 2

shoppingCartStore.subscribe((cart) => 
  console.log('show miniCart', JSON.stringify(cart))
)

shoppingCartStore.makeKey = (productId, optionsIds) => {
  return JSON.stringify([productId].concat(optionIds.sort((a,b) => a - b)))
}

shoppingCartStore.increment = (productId, optionIds, computedPrice) => {
  const newKey = shoppingCartStore.makeKey(productId, optionIds)
  let cart = shoppingCartStore.get().data
  if (cart == undefined) {
    cart = []
  }
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
  shoppingCartStore.set({data: cart, updatedAt: Date.now()})
}

shoppingCartStore.length = () => {
  return shoppingCartStore.get().data.length
}

shoppingCartStore.deleteItem = (lineKey) => {
  //console.log(product)
  $shoppingCartStore.data = shoppingCartStore.data.filter(line => line[0] != lineKey)
  $shoppingCartStore = $shoppingCartStore
}

shoppingCartStore.totalQuantity = () => {
  const cart = shoppingCartStore.get().data
  return cart.map(lineItem => lineItem[QUANTITY_INDEX])
             .reduce((sum, x) =>  sum + x, 0)
}

export const computePrice = (basePrice, selectedOption, onlineFactor) => {
  let additional = 0
  if (selectedOption) {
    additional = selectedOption.price_modifier
  }
  return parseInt(Math.ceil(onlineFactor * (basePrice + additional)))
}

export const total = () => {
  const cart = shoppingCartStore.get().data
  return cart.map(line => line[QUANTITY_INDEX] * line[PRICE_INDEX])
   .reduce((sum, x) => sum + x, 0)
}

export const parseLineItem = (lineItem) => {
  // The line item key is a compound key created by stringifying [productId, optionIds.sort((a, b) => a - b)].
  let [lineKey, quantity, price]  = lineItem
  let ids = JSON.parse(lineKey)
  let [productId, ...optionIds] = ids
  return [lineKey, productId, optionIds, quantity, price]
}

// export const saveCart = async (cartContents, authToken) => {
//   if (authToken == undefined) { return }
//   try {
//     // Check if cartContents is in the correct format
//     if (typeof cartContents !== "string" || !JSON.parse(cartContents).length) {
//       throw new Error("Invalid cartContents format. It must be a string.");
//     }

//     // Set up the request headers
//     const headers = new Headers({
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${authToken}`,
//     });

//     // Set up the request options
//     const requestOptions = {
//       method: "POST",
//       headers: headers,
//       body: cartContents,
//     };

//     // Make the fetch request to update the cart
//     const response = await fetch("/cart", requestOptions);

//     // Check if the response is successful
//     if (!response.ok) {
//       throw new Error(`Failed to update cart. Status: ${response.status}`);
//     }

//     // Parse and return the JSON response
//     const jsonResponse = await response.json();
//     return jsonResponse;
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     return null;
//   }
// }

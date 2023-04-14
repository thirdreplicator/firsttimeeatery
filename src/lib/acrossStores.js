import { currentUser, isLoggedIn } from "../stores/CurrentUserStore"
import { shoppingCartStore, saveCart } from "../stores/ShoppingCartStore"

export const saveCartOnServer = async () => {
  const user = currentUser.get()
  const cart = shoppingCartStore.get()
  if (isLoggedIn(user)) {
    const resp = await saveCart(JSON.stringify(cart), user.token)
    console.log('update cart in redis', resp)
  }
}
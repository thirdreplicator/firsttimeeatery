import { writable } from "svelte/store"

export const product_store = writable([
  {"id":1,"name":"Taro Boba Milk Tea","category_id":1,"image":"taro-boba-medium.webp","is_original":false,"price":75,"category":"Boba Tea"}
])


import { writable } from "svelte/store"

export const category_store = writable([
  { name: "Boba Tea", id: 1 },
  { name: "Burgers", id: 2 },
])

export const current_category = writable(1)



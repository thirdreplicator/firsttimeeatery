<script>
  export let lineItem

  import { shoppingCartStore, parseLineItem } from "../stores/ShoppingCartStore"
  import { productStore } from "../stores/ProductStore"
  import { saveCartOnServer } from '../lib/acrossStores'

  let [lineKey, productId, optionIds, quantity, price] = parseLineItem(lineItem)
  let product = {...$productStore[productId][0]}
  
  product.selectedOptions = [...optionIds]
  product.image = product.image.replace(/\.[^/.]+$/, ".avif")

  const getOptionInfo = (productId, optionId) => $productStore[productId][0].options.filter(o =>  o.id == optionId)[0]
  const getIndex = () => {
    let  i =  -1
    $shoppingCartStore.data.forEach((row, k) => {
      if (row[0] == lineKey) {
        i = k
      }
    })
    return i
  }

  const getOptionText = (productId, optionIds) => {
    let optionText = ''
    optionIds.forEach(optionId => {
      let option = getOptionInfo(productId, optionId)
      if (optionText.length > 0) {
        optionText += ", " + option.name
      } else {
        optionText = option.name
      }
    });
    return optionText
  }
  
  let optionText = getOptionText(productId, optionIds)

  const incrementQuantity = async () => {
    quantity += 1
    $shoppingCartStore.data[getIndex()][1] += 1
    $shoppingCartStore.updatedAt = Date.now()
    $shoppingCartStore = $shoppingCartStore
    await saveCartOnServer()
  }
  const decrementQuantity = async () => {
    quantity -= 1
    $shoppingCartStore.data[getIndex()][1] -= 1
    $shoppingCartStore.updatedAt = Date.now()
    if (quantity == 0) {
      shoppingCartStore.deleteItem(lineKey)
    }
    $shoppingCartStore = $shoppingCartStore
    await saveCartOnServer()
  }
</script>
<li class="flex py-6 items-center">
  <div
    class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200"
  >
    <img
      src="/images/products/thumb/{ product.image }"
      alt="{ product.name } image"
      class="h-full w-full object-cover object-center"
    />
  </div>

  <div class="ml-4 flex flex-1 flex-col">
    <div>
      <div
        class="flex justify-between text-base font-medium text-gray-900"
      >
        <h3>
          <a alt="{product.name}">{product.name}</a>
        </h3>
        <p class="ml-4">
          {#if quantity > 1}
          <span class="whitespace-nowrap">
            { quantity } × ₱{price}
          </span>
          {:else}
            ₱{price}
          {/if}
      </p>
      </div>
      <p class="options mt-1 text-sm text-gray-500">{ optionText }</p>
    </div>
    <div class="flex items-center justify-between text-sm mt-2">
      <div class="flex grow">
        <label class="">
          Qty:
          <input
            type="text"
            value="{ quantity }"
            size="2"
            class="text-gray-500 h-10 ml-1"
          />
        </label>
        <div class="flex flex-col justify-between ml-2">
          <button on:click={ incrementQuantity }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="plus-small w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v12m6-6H6"></path>
            </svg>
          </button>
          <button  on:click={ decrementQuantity }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="minus w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 12H6"></path>
            </svg>
          </button>
        </div>
      </div>
      <div>
        <button on:click={ async () => {
          shoppingCartStore.deleteItem(lineKey)
          await saveCartOnServer()
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="trash w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</li>

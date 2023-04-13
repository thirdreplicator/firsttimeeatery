<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../stores/CurrentUserStore.js';

  let lineItems = {data: [], updatedAt: 0 };
  import { productStore } from "../stores/ProductStore";
  import CheckoutLineItem from './CheckoutLineItem.svelte';
  import { parseLineItem } from '../stores/ShoppingCartStore.js';

  const products = productStore.get()
  const productsById = Object.keys(products).reduce((accumulator, productId) => {
     return { ...accumulator, [productId]: products[productId][0] }
   }, {})
  const getOptionInfo = (productId, optionId) => productsById[productId].options.filter(o =>  o.id == optionId)[0]
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
  
  
  let hydratedLineItems
  let error = null;

  onMount(async () => {
    const user = currentUser.get();
    if (user && user.token) {
      try {
        const response = await fetch('/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        lineItems = await response.json();
        console.log('---------', lineItems)
        hydratedLineItems = lineItems.data.reduce((accum, lineItem) => {
          let [lineKey, productId, optionIds, quantity, price] = parseLineItem(lineItem)
          const obj =  {
            name: productsById[productId].name,
            optionText: getOptionText(productId, optionIds),
            quantity,
            price
          }
          return [...accum, obj]
        }, [])
        console.log('line 31',  hydratedLineItems)
        
      } catch (err) {
        error = err.message;
      }
    }
  });
</script>

<div class="mt-4">
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else if hydratedLineItems == undefined || (lineItems.data && lineItems.data.length == 0) }
    <div class="text-center">
      <p>Your cart is empty.</p>
    </div>
  {:else}
    <table class="min-w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <th class="py-3 px-6 text-left">Product</th>
          <th class="py-3 px-6 text-left">Options</th>
          <th class="py-3 px-6 text-center">Quantity</th>
          <th class="py-3 px-6 text-center">Price</th>
        </tr>
      </thead>
      <tbody class="text-gray-600 text-sm font-light">
        {#each hydratedLineItems as lineItem}
          <CheckoutLineItem lineItem ={ lineItem } />
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<!-- Add any additional checkout UI elements here -->

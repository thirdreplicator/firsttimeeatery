<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../stores/CurrentUserStore.js';

  let lineItems = {data: [], updatedAt: 0 };
  let showEmptyCart = 'none'
  import { productStore } from "../stores/ProductStore";
  import CheckoutLineItem from './CheckoutLineItem.svelte';
  import { shoppingCartStore, parseLineItem } from '../stores/ShoppingCartStore.js';
  import { selectPrimaryDeliveryAddress } from '../lib/deliveryAddressUtils.js'
    import DeliveryAddress from './DeliveryAddress.svelte';
  
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
  
  let deliveryAddresses
  let primaryAddress
  let showDeliveryAddress = 'none'
  let hydratedLineItems
  let error = null;

  onMount(async () => {
    const user = currentUser.get();
    if (0 == shoppingCartStore.totalQuantity()) {
      showEmptyCart = 'block'
    }

    // Fetch cart from /api/cart
    if (user && user.token) {
      try {
        const response = await fetch('/api/cart', {
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
        hydratedLineItems = lineItems.data.reduce((accum, lineItem) => {
          let [lineKey, productId, optionIds, quantity, price] = parseLineItem(lineItem)
          const obj =  {
            key: 'lineItem-' + lineKey,
            name: productsById[productId].name,
            image: productsById[productId].image.replace(/\.[^/.]+$/, ".avif"),
            optionText: getOptionText(productId, optionIds),
            quantity,
            price
          }
          return [...accum, obj]
        }, [])
        
      } catch (err) {
        error = err.message;
      }
    }

    // Fetch delivery address from /delivery_addresses
    if (user && user.token) {
      try {
        const response = await fetch('/api/delivery_addresses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        deliveryAddresses = await response.json();
        primaryAddress = selectPrimaryDeliveryAddress(deliveryAddresses)
        console.log('delivery_addresses', primaryAddress)
 
      } catch (err) {
        error = err.message;
      }
    }
  });

  let computeTotal = (lineItems) => {
    return lineItems.reduce((sum, lineItem) => sum + lineItem.quantity*lineItem.price, 0)
  }

  const changeAddress = () => alert("Add an address")
  
</script>
<h1 class="text-center text-3xl">Checkout
  <span class="text-2xl font-medium hidden" style='display: {shoppingCartStore.totalQuantity() > 0 ? 'inline' : 'none'}'>
    ({shoppingCartStore.totalQuantity()} items)
  </span>
</h1>

<div class="mt-4">
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else if hydratedLineItems == undefined || (lineItems.data && lineItems.data.length == 0) }
    <div class="text-center hidden" style="display: {showEmptyCart}">
      <p>Your cart is empty.</p>
    </div>
  {:else}

  <div class='flex'>
    <div class='right flex-auto'>
      <div class='flex py-3'>
        <div class='font-semibold text-lg text-left w-5 py-3'>1</div>
        <h2 class="col-span-1 text-left font-semibold text-lg pr-10 py-3">Delivery Address</h2>
        <div class="col-span-3 text-left font-light text-base py-3 flex-1">
          {#if deliveryAddresses && deliveryAddresses.length > 0 }
            <DeliveryAddress address={ primaryAddress } />
          {:else }
            No addresses found. Click "Change" to add a delivery location.
          {/if}
        </div>
        <div class="action col-span-1 text-center text-base px-3 py-3"><a on:click={ changeAddress }>Change</a></div>
      </div>
      <div class='flex py-3'>
        <div class='font-semibold text-lg text-left w-5 py-3'>2</div>
        <h2 class="col-span-1 text-left font-semibold text-lg pr-10 py-3 ">Payment method </h2>
        <div class="col-span-3 text-left  font-light text-base py-3  flex-1">
          Cash on Delivery (COD)
        </div>
        <div class='col-span-1 text-center text-base px-3 py-3 text-right' ><a></a></div>
      </div>

      <div class='flex'>
        <div class='font-semibold text-lg text-left w-5 py-3'>3</div>
        <h2 class="flex-auto text-left font-semibold text-lg py-3">Review items </h2>
      </div>
    </div>
  </div>

  <div class="divide-y divide-gray-200">
    <div class="grid grid-cols-4 gap-4 py-3 px-6 bg-gray-200 text-gray-600 uppercase text-sm font-semibold">
      <div class="col-span-1 text-left">Product</div>
      <div class="col-span-1 text-left">Options</div>
      <div class="col-span-1 text-center"></div>
      <div class="col-span-1 text-center">Price</div>
    </div>
    <div class="text-gray-900 bg-white font-light">
        {#each hydratedLineItems as lineItem (lineItem.key) }
          <CheckoutLineItem lineItem ={ lineItem } />
        {/each}
    </div>


  <div class="flex flex-wrap py-6">
    <div class='px-6 text-left'>
      <button
        class="color-order-button shadow-xl hover:shadow-md text-black font-semibold text-base py-2 px-6 rounded transition duration-100 ease-in-out"
      >
        Place your order
      </button>
    </div>
    <div class="color-price text-left flex-1 px-6 text-xl font-semibold">Order total: ₱{computeTotal(hydratedLineItems)}</div>
  </div>


  </div>
  {/if}
</div>

<style>
  .color-price {
    color: #B12704;
  }
  .color-order-button {
    background-color: rgb(255, 216, 20);
    transition: box-shadow 0.15s ease-in-out;
    border-radius: 8px;
    
  }
  .color-order-button:hover,  .color-order-button:active {
    background-color: rgb(245, 205, 19);
  }
  .color-order-button:active {
    border-radius: 8px;
    border-color: #008296;
    
  }
</style>
<!-- Add any additional checkout UI elements here -->

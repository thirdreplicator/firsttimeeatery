<script>
  import { onMount } from 'svelte';
  import { currentUser, isLoggedIn } from '../stores/CurrentUserStore.js';


  let lineItems = {data: [], updatedAt: 0 };
  let showEmptyCart = 'none'
  import { productStore } from "../stores/ProductStore";
  import CheckoutLineItem from './CheckoutLineItem.svelte';
  import { shoppingCartStore, parseLineItem } from '../stores/ShoppingCartStore.js';
  import { selectPrimaryDeliveryAddressIndex, selectPrimaryDeliveryAddressIndexFromId } from '../lib/deliveryAddressUtils.js'
  import DeliveryAddressCard from './DeliveryAddressCard.svelte';
  //import DeliveryAddressDrawer from './DeliveryAddressDrawer.svelte'  
  import { saveDeliveryAddress, patchPrimaryAddress, deleteAddress } from '../lib/deliveryAddressUtils.js';

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
  
  const DEFAULT_FORM_DATA = {
    province: 'Negros Oriental',
    city: 'Dumaguete City',
  }
  let deliveryAddresses =[]
  let primaryAddressIndex = 0
  $: primaryAddress = deliveryAddresses.length > 0 ? deliveryAddresses[primaryAddressIndex] : undefined
  let showDeliveryAddress = 'none'
  let showNewAddressForm = false
  let selectedAddressRadioButton 
  let formData = {...DEFAULT_FORM_DATA}
  let hydratedLineItems
  let error = null;

  let handleSubmit = async () => {
    let token
    // Get the auth token
    if (isLoggedIn(currentUser.get())) {
      token = currentUser.get().token
    } else {
      alert('Please login before saving your address.')
    }

    deliveryAddresses = await saveDeliveryAddress(formData, token)
    deliveryAddresses.forEach(address => {
      if (address.use_as_primary) {
        selectedAddressRadioButton = address.id
      }
    })
    const response = selectPrimaryDeliveryAddressIndex(deliveryAddresses)
    if (response instanceof Error) {
      console.log("An error occurred after attempting to save a new delivery address:", response)
    } else {
      primaryAddressIndex = response
      console.log("Response after saving a new delivery address:", response)
    }
    console.log(response)
    formData = {...DEFAULT_FORM_DATA}
  }

  const toggleNewAddressForm = () =>  {
    showNewAddressForm = !showNewAddressForm
  }

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
        deliveryAddresses.forEach(address => {
          if (address.use_as_primary) {
            selectedAddressRadioButton = address.id
          }
        })
        primaryAddressIndex = selectPrimaryDeliveryAddressIndex(deliveryAddresses)
 
      } catch (err) {
        error = err.message;
      }
    }
  });

  let computeTotal = (lineItems) => {
    return lineItems.reduce((sum, lineItem) => sum + lineItem.quantity*lineItem.price, 0)
  }

  const changeAddress = () => alert("Add an address")

  const handleAddressSelection = async e => {
    primaryAddressIndex = selectPrimaryDeliveryAddressIndexFromId( deliveryAddresses, e.target.value)
    const primaryAddressId = e.target.value
    await patchPrimaryAddress({id: primaryAddressId}, currentUser.get().token)
  }

  const  handleClickOnTrash = async address => {
    const resp = await deleteAddress({id: address.id}, currentUser.get().token)
    if (resp instanceof Error) {
      console.log('handleClickOnTrash response', resp.message)
    }
    deliveryAddresses = deliveryAddresses.filter((item) => item.id !== address.id);
    primaryAddressIndex = selectPrimaryDeliveryAddressIndex(deliveryAddresses)
  }
  
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
    <div class='flex-auto'>
      <div class='flex py-3'>
        <div class='font-semibold text-lg text-left w-5 py-3'>1</div>
        <h2 class="col-span-1 text-left font-semibold text-lg pr-10 py-3">Delivery Address</h2>
        <div class="col-span-3 text-left font-light text-base py-3 flex-1">
          {#if deliveryAddresses && deliveryAddresses.length > 0 }
            <DeliveryAddressCard address={ primaryAddress } />
          {:else }
            No addresses found associated with this account.
          {/if}
          {#if showNewAddressForm }
          <div>


            {#if deliveryAddresses && deliveryAddresses.length > 0}
          <div class='border-2 border-sky-500 rounded-lg mt-4 p-4'>
            <h2 class='font-medium'>All delivery addresses</h2>
            <div class='flex gap-4 mt-4'>
              <h3 class="text-sm font-medium w-12">Primary</h3>
            </div>
              {#each deliveryAddresses as address, i}
              <div class='flex gap-4 py-3 hover:bg-gray-200'>
                <div class="items-center text-center w-12">
                  <input
                    type="radio"
                    class="mr-2"
                    bind:group={ selectedAddressRadioButton }
                    value={address.id}
                    on:click={ handleAddressSelection }
                  />
                  </div>
                  <div>
                    {address && address.recipient},
                    {address.street},
                    {address.barangay},
                    {address.city},
                    {address.province}
                    {address.zip ? address.zip : ''} &nbsp;
                    {#if address.phone }
                      Phone: <span class='font-medium'>{ address.phone }</span>
                    {/if}
                    
                  </div>
                  <div class='flex-1 text-right'>
                    <button class='trash ml-6'
                      on:click={ () => handleClickOnTrash(address) } >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              {/each}
              </div>
            {/if}

            <div class="max-h-[calc(100%+8rem)] flex-auto overflow-y-auto mt-4">
              <!-- Your form content here -->
              <form
                class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                on:submit|preventDefault={handleSubmit}
              >
                <div class="flex flex-wrap -mx-2">
                  <div class="w-1/2 px-2 mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="recipient"
                    >
                      Recipient
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="recipient"
                      type="text"
                      placeholder="Name"
                      bind:value={formData.recipient}
                    />
                  </div>
                  <div class="w-1/2 px-2 mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="phone"
                    >
                      Phone
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phone"
                      type="text"
                      placeholder="Phone Number"
                      bind:value={formData.phone}
                    />
                  </div>

                  <div class="w-full px-2 mb-4">
                    <label
                           class="block text-gray-700 text-sm font-bold mb-2"
                           for="street"
                         >
                    Street
                    </label>
                    <input
                           class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           id="street"
                           type="text"
                           placeholder="Street"
                           bind:value={formData.street}
                         />
                    </div>

                  <div class="w-1/2 px-2 mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="province"
                    >
                      Province
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="province"
                      type="text"
                      placeholder="Province"
                      bind:value={formData.province}
                    />
                  </div>

                  <div class="w-1/2 px-2 mb-4 hidden">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="_placeholder"
                    >
                      Placeholder
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="_placeholder"
                      type="text"
                      placeholder=""
                      
                    />
                  </div>
                  
                  <div class="w-1/2 px-2 mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="city"
                    >
                      City
                    </label>
                    <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="city"
                      type="text"
                      placeholder="City"
                      bind:value={formData.city}
                    />
                  </div>
                  <div class="w-1/2 px-2 mb-4">
                    <label
                      class="block text-gray-700 text-sm font-bold mb-2"
                      for="barangay"
                    >
                      Barangay
                    </label>
                    <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="barangay"
                    type="text"
                    placeholder="Barangay"
                    bind:value={formData.barangay}
                  />
             </div>

             <div class="w-full px-2 mb-4">
             <label
                    class="block text-gray-700 text-sm font-bold mb-2"
                    for="special_instructions"
                  >
             Special Instructions / Note for Delivery Person
             </label>

             <textarea
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="special_instructions"
                    placeholder="Special Instructions"
                    bind:value={formData.special_instructions}
                  ></textarea>
             </div>
             </div>
             <div class="flex items-center justify-between">
             <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
              Save New Address
             </button>
             </div>
             
               </form>
             </div>



          </div>
          {/if}
        </div>
        <div class="action col-span-1 text-center text-base px-3 py-3">
          <a id='change-primary-address'
              on:click={ toggleNewAddressForm }
              class="text-sky-500 hover:text-sky-700 font-medium">
          Change
        </a>
        </div>
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

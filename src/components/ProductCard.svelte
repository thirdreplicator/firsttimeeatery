<script>
  export let id = -1
  export let name = "Default Name"
  export let price = "42.00"
  export let image = "taro-boba-medium.webp"
  export let onlineFactor = 1.0
  // We will access the product options through the persistent nanostore.
  import { productStore } from "../stores/ProductStore";

  import { shoppingCartStore, computePrice } from "../stores/ShoppingCartStore"
  import { saveCartOnServer } from "../lib/acrossStores";
  import { current_category } from "../stores/CategoryStore";
  
  const current_product = $productStore[id][0]

  let options
  if (current_product.options == undefined) {
    options =  []
  } else {
    options =[...current_product.options]
  }
  let defaultOption = options.filter(o => o.is_default)[0]
  let selected = defaultOption
  let selectedOption = defaultOption
  
  const addToCart = () => {
    const computedPrice = computePrice(price, selectedOption, onlineFactor)
    const optionIds = selectedOption ? [selectedOption.id] : []
    shoppingCartStore.increment(id, optionIds, computedPrice)
    animateImageToSchoppingCart()
    saveCartOnServer()
  }

  const transitionMs = 300
  const startDelayMs = 10
  const animationEnd = transitionMs + startDelayMs

  const animateImageToSchoppingCart = () => {
    const el = document.getElementById('product-image-' + current_product.id)
    const clone = el.cloneNode(true)
    clone.style.position = "absolute"
    clone.style.left = el.offsetLeft + "px";
    clone.style.top = el.offsetTop + "px";
    clone.style.width = el.offsetWidth + "px";
    clone.style.height = el.offsetHeight + "px";
    document.body.appendChild(clone);

    const cart = document.getElementById("shopping-cart-button");
    const targetX = cart.offsetLeft;
    const targetY = cart.offsetTop;

    setTimeout(function() {
      clone.style.left = targetX + "px";
      clone.style.top = targetY + "px";
      clone.style.width = "0px";
      clone.style.height = "0px";
      clone.style.opacity = "0";
    }, startDelayMs);

    setTimeout(function() {
      clone.remove()
    }, animationEnd)
  }

</script>
<div class="my-1 mx-0 w-full md:w-1/2 my-4 md:px-4 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
  <article class="overflow-hidden rounded-lg shadow-lg">
    <a>
      <img
        id={'product-image-' + current_product.id}
        class="product-image block h-auto w-full select-none drag-none"
        src={"/images/products/" + image}
        alt="{ name } image"
      />
    </a>
    <div class="flex items-center justify-between leading-tight p-2 md:p-4">
      <h5
        class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate max-w-sm"
      >
        <a>
          { name }
        </a>
      </h5>
    </div>
    <div class="flex items-center mt-2.5 mb-5 px-4">
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><title>First star</title><path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path></svg
      >
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Second star</title><path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path></svg
      >
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Third star</title><path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path></svg
      >
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Fourth star</title><path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path></svg
      >
      <svg
        aria-hidden="true"
        class="w-5 h-5 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><title>Fifth star</title><path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        ></path></svg
      >
      <span
        class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3"
        >5.0</span
      >
    </div>
    {#if (options.length > 0) }
    <div class="flex items-center justify-between px-4 pb-4 mt-4">
      <label> Size:
      <select bind:value={selected} on:change="{() => {
        selectedOption = selected;
      }}">
        {#each options as option ('option_'+option.id)}
          <option value={option}>
            {option.name}
          </option>
        {/each}
      </select>
    </label>
    </div>
    {/if}
    <div class="flex items-center justify-between px-4 pb-4 mt-4">
      <span class="text-3xl font-bold text-gray-900 dark:text-white"
        >₱{ computePrice(price, selectedOption, onlineFactor) }</span
      >
      <a href="#"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        on:click|preventDefault={ addToCart }
        >Add to cart</a
      >
    </div>
  </article>
</div>

<style>
  .product-image {
    transition: all 300ms ease-in-out;
  }
</style>

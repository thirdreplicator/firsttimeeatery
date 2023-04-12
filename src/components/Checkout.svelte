<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../stores/CurrentUserStore.js';

  let lineItems = [];
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
  {:else if lineItems.length === 0}
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
        {#each lineItems as lineItem}
          <tr class="border-b border-gray-200">
            <td class="py-3 px-6 text-left whitespace-nowrap">
              <div class="flex items-center">
                <span>{lineItem.product_name}</span>
              </div>
            </td>
            <td class="py-3 px-6 text-left">
              <div class="flex items-center">
                {#each lineItem.options as option}
                  <span>{option.name}: {option.value}, </span>
                {/each}
              </div>
            </td>
            <td class="py-3 px-6 text-center">
              <span>{lineItem.quantity}</span>
            </td>
            <td class="py-3 px-6 text-center">
              <span>${lineItem.price / 100}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<!-- Add any additional checkout UI elements here -->

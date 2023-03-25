<script>
  import { shoppingCartStore, total } from "../stores/ShoppingCartStore"; 
  import ShoppingCartItem from "./ShoppingCartItem.svelte";
  
</script>
<div>
  <div class="mt-4">
    <div class="flow-root">
      <ul role="list" class="-my-6 divide-y divide-gray-200">
        {#if $shoppingCartStore.length == 0 }
          <li class='my-8 text-xl text-center'>
            In the menu, click on "Add to Cart" for the items you want to order.
          </li>
        {:else}
          {#each $shoppingCartStore as lineItem ('line_items_' + JSON.stringify([lineItem[0]].concat(lineItem[1])))}
            <ShoppingCartItem lineItem={lineItem} />
          {/each}
        {/if}
      </ul>
    </div>

    {#if $shoppingCartStore.length > 0}
    <div class="flex mt-4 font-medium text-xl">
      <div class="flex-1">
        Total:
      </div>
      <div class="flex-1 text-right">
        ₱{ total($shoppingCartStore) }
      </div>
    </div>
    {/if}

  </div>
</div>

<script>
  export let lineItem
  import { parseLineItem } from '../stores/ShoppingCartStore.js';
</script>

<tr class="border-b border-gray-200">
  <td class="py-3 px-6 text-left whitespace-nowrap">
    <div class="flex items-center">
      <span>{ lineItem.name }</span>
    </div>
  </td>
  <td class="py-3 px-6 text-left">
    <div class="flex items-center">
      <span>{ lineItem.optionText }</span>
    </div>
  </td>
  <td class="py-3 px-6 text-center">
    <span>{lineItem.quantity}</span>
  </td>
  <td class="py-3 px-6 text-center">
    <span>₱{ lineItem.price }</span>
  </td>
</tr>


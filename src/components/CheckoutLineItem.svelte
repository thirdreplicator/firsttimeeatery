<script>
  export let lineItem
</script>
<div
  class="grid grid-cols-4 gap-4 py-3 px-6 border-b border-gray-200 items-center"
>
  <div class="col-span-1">
    <span>{lineItem.name}</span>
  </div>
  <div class="col-span-1">
    <span>{lineItem.optionText}</span>
  </div>
  <div class="col-span-1 text-center">
    <img src="/images/products/thumb/{ lineItem.image }" />
  </div>
  <div class="col-span-1 text-center">
    <span>{lineItem.quantity} × ₱{ lineItem.price}</span>
  </div>
</div>
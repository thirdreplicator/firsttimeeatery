<script>
  export let address
  let show = 'none'
  let showSpecialInstructions = 'none'
  if (address) {
    show = 'block'
  }
  if (address && address.special_instructions) {
    showSpecialInstructions = 'block'
  }
</script>
{#if address }
<div class='hidden' style='display: {show}'>
  <div class='flex flex-wrap'>
    <div class='font-medium pr-6'>Contact: </div>
    <div class=''>
      {address.recipient}, &nbsp;
    </div>
    <div class='text-red-800 font-bold'>{address.phone}</div>
  </div>

  <div class='mt-4'>
    {address.street}
  </div>
  <div>
    {address.city}, {address.barangay}
  </div>
  <div>
    {address.province}
    {#if address.zip }
      {address.zip}
    {/if}
  </div>
  
  <div class='hidden' style='display: { showSpecialInstructions }'>
    <div class='mt-4 flex flex-wrap'>
      <div class='pr-6 font-medium'>Special instructions: </div>
      <div class='flex-auto'>{address.special_instructions}</div>
    </div>
  </div>

</div>
{/if}
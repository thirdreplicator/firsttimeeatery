<script>
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  //import DeliveryAddressForm from './DeliveryAddressForm.svelte'
  export let toggleButtonId
  export let addresses

  let showDrawer = false;
  let showAddressForm = true;
  let selectedAddress = 0;
  let formData = {}

  function toggleDrawer() {
    showDrawer = !showDrawer;
  }

  function addNewDeliveryAddress() {
    console.log('Adding a new delivery address...');
    showAddressForm = true
  }

  
</script>
<div class=''>



  <div class='flex'>
    <div class=' flex-auto'>

    {#if addresses && addresses.length > 0}
    <div class='flex gap-4 py-3'>
      <h3 class="text-sm mb-2 font-medium w-12">Primary</h3>
      <div class='flex-1'>&nbsp;</div>
    </div>
      {#each addresses as address, i}
      <div class='flex gap-4 py-3'>
        <div class="items-center text-center w-12">
          <input
            type="radio"
            class="mr-2"
            bind:group={selectedAddress}
            value={address.id}
          />
          </div>
          <div>
            {address && address.recipient}, {address.street}, {address.barangay}, {address.city}, {address.province} {address.zip} &nbsp; Phone: { address.phone }
          </div>
        </div>
      {/each}
    {/if}

    {#if showAddressForm }
    <div
    class="fixed inset-x-0 bottom-0 bg-white p-4 shadow-md"
    class:hidden={!showDrawer}
    transition:fly="{{ y: 100, duration: 300 }}"
  >
  
  </div>
    {:else}
      <p
        class="mt-4 text-blue-500 cursor-pointer underline"
        on:click={ addNewDeliveryAddress }
      >
      ＋ Add a new delivery address
      </p>
    {/if}

      </div><!-- flex -->
    </div><!-- flex-auto -->

  </div><!-- fixed -->

<script>
  export let address
  let showSpecialInstructions = 'none'
  if (address.special_instructions) {
    showSpecialInstructions = 'block'
  }
</script>

<div>
  <div class='flex'>
    <div class='font-medium pr-6'>Contact: </div>
    <div>
      {address.recipient}, <span class='text-red-800 font-bold'>{address.phone}</span>
    </div>
  </div>

  <div class='mt-4'>
    {address.street}
  </div>
  <div>
    {address.city}, {address.barangay}
  </div>
  <div>
    {address.province} {address.zip}
  </div>
  
  <div class='hidden' style='display: { showSpecialInstructions }'>
    <div class='mt-4 flex'>
      <div class='pr-6 font-medium'>Special instructions: </div>
      <div class='flex-auto'>{address.special_instructions}</div>
    </div>
  </div>

</div>

<!--
  
INSERT INTO delivery_addresses (user_id, recipient,  phone, street, city, province, barangay, zip, special_instructions)
VALUES (108, 'David Beckwith', '+63-912-345-6789', 'Palm Street', 'Dumaguete City', 'Negros Oriental', 'Daro', '6200', 'Please call when you reach Palm St.');

-->
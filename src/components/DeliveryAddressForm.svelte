<script>
  export let showDrawer
  let formData = {
    recipient: "",
    phone: "",
    street: "",
    city: "",
    barangay: "",
    province: "",
    zip: "",
    special_instructions: "",
  };

  function handleSubmit() {
    // Handle form submission logic here
    console.log(formData);
  }
</script>


export const selectPrimaryDeliveryAddressIndex = (allAddresses) => {
  for(let i=0; i < allAddresses.length; i++) {
    if (allAddresses[i].use_as_primary) {
      return i
    }
  }
  return 0
}

export  const selectPrimaryDeliveryAddressIndexFromId = (allAddresses, id) => {
  for( let i=0; i < allAddresses.length; i++ ) {
    if (allAddresses[i].id == id) {
      return i
    }
  }
  return 0
}

export const saveDeliveryAddress = async (formData, authToken) => {
  if (authToken == undefined) { return new Error('auth token undefined.')}
  try {

    const jsonBody = JSON.stringify(formData)

    // Set up the request headers
    const headers = new Headers({
      "Authorization": `Bearer ${authToken}`,
    });

    // Set up the request options
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: jsonBody,
    };

    // Make the fetch request to update the delivery address
    const response = await fetch("/api/delivery_addresses", requestOptions);

    // Check if the response is successful
    if (!response.ok) {
      return new Error(`Failed to update delivery address. Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(`Save Error: ${error.message}`);
    return error;
  }
}

export const patchPrimaryAddress = async (data, authToken) => {
  if (authToken == undefined) { return new Error('auth token undefined.')}
  try {

    const jsonBody = JSON.stringify({...data, action: 'set_primary'})

    // Set up the request headers
    const headers = new Headers({
      "Authorization": `Bearer ${authToken}`,
    });

    // Set up the request options
    const requestOptions = {
      method: "PATCH",
      headers: headers,
      body: jsonBody,
    };

    // Make the fetch request to update the delivery address
    const response = await fetch(`/api/delivery_addresses`, requestOptions);

    // Check if the response is successful
    if (!response.ok) {
      return new Error(`Failed to update delivery address. Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(`Save Error: ${error.message}`);
    return error;
  }
}


export const deleteAddress = async (data, authToken) => {
  if (authToken == undefined) { return new Error('auth token undefined.')}
  try {

    const jsonBody = JSON.stringify(data)

    // Set up the request headers
    const headers = new Headers({
      "Authorization": `Bearer ${authToken}`,
    });

    // Set up the request options
    const requestOptions = {
      method: "DELETE",
      headers: headers,
      body: jsonBody,
    };

    // Make the fetch request to update the delivery address
    const response = await fetch("/api/delivery_addresses", requestOptions);

    // Check if the response is unsuccessful
    if (!response.ok) {
      return new Error(`Failed to update delivery address. Status: ${response.status}`);
    }

    // Parse and return the JSON response
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error(`Save Error: ${error.message}`);
    return error;
  }
}
export const selectPrimaryDeliveryAddress = (allAddresses) => {
  let primaryAddress
  if (allAddresses.length == 1) {
    return allAddresses[0]
  }
  allAddresses.forEach(address => {
    if (address.use_as_primary) {
      return address
    }
  })
  return primaryAddress
}


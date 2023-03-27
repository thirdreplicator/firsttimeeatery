// Index a list of objects by the value of one of the keys.
export const indexByKey = (options, byKey) => {
  let optionsByProductId = {};
  options.forEach((o) => {
    if (optionsByProductId[o[byKey]] == undefined) {
      optionsByProductId[o[byKey]] = [];
    }
    optionsByProductId[o[byKey]] = optionsByProductId[o[byKey]].concat(o);
  });
  return optionsByProductId;
};

export const onClickBackdrop = () => {
  document.querySelectorAll('div[drawer-backdrop]')
    .forEach(el => el.addEventListener("click", (e) => {
      document.querySelectorAll('div[drawer-backdrop]')
        .forEach(e => e.remove())}))
}
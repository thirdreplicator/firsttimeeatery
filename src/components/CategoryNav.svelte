<script>
  import { category_store } from  '../stores/CategoryStore.js'
  import CategoryNavButton from './CategoryNavButton.svelte';

  import { onMount } from "svelte";
  import { Drawer } from "flowbite";

  onMount(() => {
    const targetEl = document.getElementById("category-drawer");
    const categoryButton = document.getElementById("category-button")
    const categoryHideButton = document.getElementById("category-hide-button")
    const options = {
      placement: "left",
      backdrop: true,
      bodyScrolling: false,
      edge: false,
      edgeOffset: "",
      backdropClasses:
        "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30",
      onHide: () => {},
      onShow: () => {
        document.querySelectorAll('div[drawer-backdrop]')
        .forEach(el => el.addEventListener("click", (e) => {
          console.log('clicked on backdrop')
          var event = new KeyboardEvent('keydown', {'key': 'Escape'});
          document.dispatchEvent(event);
          document.querySelectorAll('div[drawer-backdrop]')
            .forEach(e => e.remove())}))
      },
      onToggle: () => {},
    };

    const drawer = new Drawer(targetEl, options);
    categoryButton.addEventListener("click", () => drawer.show())
    categoryHideButton.addEventListener("click", () => drawer.hide())
  });
</script>


<!-- drawer init and toggle -->
<div class="text-center">
  <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    type="button"
    id='category-button'
    data-drawer-target="category-drawer" 
    data-drawer-show="category-drawer" 
    aria-controls="category-drawer">
  Other Categories
  </button>
</div>

<!-- drawer component -->
<div id="category-drawer" 
  class="fixed top-0 left-0 z-40 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800"
  tabindex="-1"
  aria-labelledby="drawer-label"
  >
  <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
    Menu Categories:
  </h5>
  <button 
    id="category-hide-button"
    type="button"
    data-drawer-hide="category-drawer"
    aria-controls="category-drawer"
    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
    >
     <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
     <span class="sr-only">Close menu</span>
  </button>
  <div class="grid grid-cols-1 gap-2">
     <!-- <a class="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Back</a> -->
    { #each $category_store as category }
      <CategoryNavButton name={ category.name } id={ category.id }/>
    { /each }
     
  </div>
</div>




<script>
  import { current_category } from "../stores/CategoryStore";
  
  export let name = "Default Name"
  export let id = -1

  const showCategory = () => {
    current_category.set(id)
  }
</script>

  <button id="category-button" data-category-id={ id } on:click={ showCategory } class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
    { name }
  </button>

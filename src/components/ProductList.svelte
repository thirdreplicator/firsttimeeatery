<script>  
  export let frontmatter = "[]"
  let products = JSON.parse(frontmatter)
  import ProductCard from "./ProductCard.svelte";
  import { current_category } from "../stores/CategoryStore";

  // Save the index of products to localStorage
  import { indexByKey } from "../lib/utils";
  const productsById = indexByKey(products, "id");

  import { productStore } from "../stores/ProductStore";
  productStore.set(productsById)

</script>

<div class="flex flex-wrap -mx-1 lg:-mx-4">
{#each products.filter(p => $current_category < 0 ? true : (p.category_id == $current_category)) as product ('product_' + product.id) }
  <ProductCard
    id={ product.id }
    name={ product.name } 
    price={ product.price }
    image={ product.image } 
    onlineFactor={ 1.25 }
    />
{/each}
</div>
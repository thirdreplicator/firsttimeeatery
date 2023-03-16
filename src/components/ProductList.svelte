<script>  
  export let frontmatter = "[]"
  let all_products = JSON.parse(frontmatter)
  import ProductCard from "./ProductCard.svelte";
  import { current_category } from "../stores/CategoryStore";
</script>

<div class="flex flex-wrap -mx-1 lg:-mx-4">
{#each all_products.filter(p => $current_category < 0 ? true : (p.category_id == $current_category)) as product }
  <ProductCard name={ product.name } price={ product.price } image={ product.image } />
{/each}
</div>
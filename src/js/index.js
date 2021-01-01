import Search from "./models/Search"; /*This is a default export*/
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import {
  elements,
  renderLoader,
  clearLoader,
} from "./views/base"; /* This is a named export*/

/** This would be contained in the state variable
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */

//This an asyn function for
const controlSearch = async () => {
  // 1) Get the query from view
  const query = searchView.getInput();

  if (query) {
    // 2) Create new search object and add to state
    // so within the state object a new object would be created for every new query
    state.search = new Search(query);

    // 3) Prepare UI for the results
    searchView.clearResults();
    searchView.clearInputs();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipe
      await state.search.getResults();

      // 5) Render the result to the UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert(
        error +
          " on index.js file, something went wrong with getting or rendering results."
      );
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});


//To click on the previous and next buttons
elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); //10 means we are operating on base 10
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});
/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get id from URL
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and pass ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert(
        error +
          "on index.js file, something went wrong with getting recipe or parsing ingredients"
      );
    }
  }
};

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);

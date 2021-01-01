import { elements } from "./base"; /*Imported DOM elements */

/*This is a function that contains values from the search forms on the UI */
export const getInput = () => elements.searchInput.value;

//We are rapping the function content in a parenthesis so as not to return anything
export const clearInputs = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

/* TO REDUCE THE RECIPE TITLE
E.g Assuming title is 'Pasta with tomatoe and spinach'
- split is a method to split a string,
meaning the title would be split into an array:['Pasta', 'with', 'tomato', 'and', 'spinanch']
A callback function and the initial value of the accumulator which is 0 in this case is passed as a parameter in the reduce method
The accumulator and current value is passed as a parameter into the callback function.
*/
/**
note that the callback keeps runing more details below
acc: 0 / acc + cur.length = 5 /newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 /newTitle = ['Pasta', 'with' ]
acc: 9 / acc + cur.length = 15 /newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 /newTitle = ['Pasta', 'with', 'tomato']
because acc + cur.length > limit and so and is not pushed into the newTitle object
 */
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    //The first parameter in the reduce method is the call back and the second parameter is the initial value of the accumulator which is zero in this case
    title.split(" ").reduce((acc, cur) => {
      //current would be Pasta
      if (acc + cur.length <= limit) {
        newTitle.push(cur); // Pasta would be pushed into the newTitle object
      }
      return acc + cur.length; // any value that we return in the callback of the reduce method becomes the new accumulator. now acc=5
    }, 0);

    //return the result
    return `${newTitle.join(" ")}...`; //join is a method used to turn arrays to strings
  }
  return title; // We could use "else {return title}" for cases where title.length < limit but it is best practice to leave it this way.
};

//Function to render recipe
const renderRecipe = (recipe) => {
  const markUp = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(
                      recipe.title
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markUp);
};

//function for the button
//type: 'prev', 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = ${
  type === "prev" ? page - 1 : page + 1
} >
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1 && pages > 1) {
    // only button to go to the next page should appear
    button = createButton(page, "next");
  } else if (page < pages) {
    //both buttons
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")} 
        `;
  } else if (page === pages && pages > 1) {
    //only button to go to prev page
    button = createButton(page, "prev");
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // Render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  // Note that the recipes parameter would be the array got from the API
  //Also note that the slice array does not contain the end value
  recipes.slice(start, end).forEach(renderRecipe);
  // We can actually make the above line of code like this
  //recipes.slice(start, end).forEach(el => renderRecipe(el)) but the way we wrote it is simpler and does exactly the same;
  // Render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};

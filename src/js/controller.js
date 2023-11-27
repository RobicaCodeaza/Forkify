import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import 'regenerator-runtime'; // Polyfilling async await
import 'core-js/actual'; // Polyfilling everything else

// Importing RecipesViewDashboard

import RecipeView from './views/RecipesView/recipeView';
import SearchView from './views/RecipesView/searchView';
import ResultsView from './views/RecipesView/resultsView';
import PaginationView from './views/RecipesView/paginationView';
import BookmarksView from './views/RecipesView/bookmarksView';
import AddRecipeView from './views/RecipesView/addRecipeView';
let bookmarksView;
let recipeView;
let searchView;
let paginationView;
let addRecipeView;
let resultsView;

// Importing MealsDashboardView
import CalendarView from './views/MealsDashboardView/CalendarView';
let calendarView;

// Importing Sidebar
import SidebarView from './views/SidebarView';
const sidebarView = new SidebarView();

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function (e) {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 0.Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1.Loading Recipe
    await model.loadRecipe(id);

    // 2.Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);

    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    console.log('Added');
    resultsView.renderSpinner();

    // 1. Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2.Load search results
    await model.loadSearchResults(query);

    // 3.Render results
    // ResultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4.Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};
// Listening for hash change
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
// Better way =>>

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render new pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings);

  // Update the recipe view
  // RecipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1.Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);
  //2. Update recipe view
  recipeView.update(model.state.recipe);
  //3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show recipe
    addRecipeView.renderSpinner();

    // Uploading recipe to the api
    await model.uploadRecipe(newRecipe);

    //Render the recipe
    recipeView.render(model.state.recipe);

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // DispLay Success Message
    addRecipeView.renderMessage();

    // Change ID - URL without refresshing
    window.history.pushState(
      (pushState = null),
      (title = null),
      `${model.state.recipe.id}`
    );
    // Closing modal
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.render('_');
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const initRecipesView = function () {
  bookmarksView = new BookmarksView();
  recipeView = new RecipeView();
  searchView = new SearchView();
  paginationView = new PaginationView();
  addRecipeView = new AddRecipeView();
  resultsView = new ResultsView();
};

const initFncRecipesView = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// -----------------------------
// MealsDashboardView
const controlCalendar = function () {
  console.log('Entered');
  model.loadCalendar('#calendar');
};

const initMealsDashboardView = function () {
  calendarView = new CalendarView();
};

const initFncMealsDashboardView = function () {
  calendarView.addHandlerRender(controlCalendar);
};

// -----------------------------
// Sidebar functionality

let recipesViewInitiate = false;
let mealsViewInitiate = false;

const resetUrl = function (view = 'MealsDashboardView') {
  history.pushState({ view: view }, '', view);
  const popStateEvent = new PopStateEvent('popstate', {
    state: { view: view },
  });
  dispatchEvent(popStateEvent);
};

const renderBefore = function (viewClass, data = '') {
  viewClass.render(data);
};

const controlMenu = function (view) {
  sidebarView.render(view);

  if (view.includes('RecipesView')) {
    resetUrl(view);
    initRecipesView();
    initFncRecipesView();
    renderBefore(bookmarksView, model.state.bookmarks);
  } else {
    initMealsDashboardView();
    initFncMealsDashboardView();
    resetUrl();
  }
};
controlMenu(window.location.toString());
sidebarView.addHandlerRender(controlMenu);

//http://localhost:1234/RecipesView#680975

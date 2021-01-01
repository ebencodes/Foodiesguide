/*we use axious in place of fetch to get data from an API because its 
a better error handler and it is more supported in older browsers. 
We have installed axios, we therefore need to import it*/
import Axios from "axios";
import { proxy, key } from "../config";

// This is a default export
export default class Search {
  constructor(query) {
    this.query = query;
  }

  // Below is the prototype of the constructor above. Method an instatnce can inherit
  //This method is used to accept the search result for a query
  async getResults() {
    try {
      const res = await Axios(
        `${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      alert(
        error +
          " on search.js file something went wrong with fetching api search results"
      );
    }
  }
}

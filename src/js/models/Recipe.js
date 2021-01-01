import Axios from "axios";
import {  proxy, key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

     async getRecipe() {
        try {
            const res = await Axios (`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error + 'on Recipe.js file, something went wrong with fetching api recipe results');
        }
    }

    calcTime () {
        //Assuming we need 15 mins for every 3 ingredients
        const numIng = this.ingredients.length;
        this.time = Math.ceil((15 * numIng)/3);
    }

    calcServings () {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });
            
            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            /**
            split method converts each ingredient in the ingredient array to an array
            ingredients: (17) ["1-1/3 cup shortening ", "1-1/2 cup sugar", "1 tsp orange zest", "1 tsp vanilla", "2 whole eggs", "8 tsp whole milk"...],
            becomes ["1-1/3", "cup", "shortening", ""]
                    ["1", "tsp", "orange", "zest"] ...
             */
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); //arrIng array is looped to find if any of its element is contained in the unitsShorts array
            // The index in which a unitsShort array element is found in the arrIng array is returned and if none -1 is returned

            let ObjIng;
            if (unitIndex > -1) {
                // Case 1: There is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                };

                ObjIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }; 
            
            } else if (parseInt(arrIng[0], 10)) { //parseInt would try to convert the string to a number and would be true if a number is present in the string e.g '1' else false 
                // Case 2: There is no unit, but the first element is a number
                ObjIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')//the join method is used to convert the array to a string
                }; 
            } else if (unitIndex === -1) {
                // Case 3: there is no unit and no number
                ObjIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }; 
            }
            return ObjIng;
        });
        this.ingredients = newIngredients;
    }
};
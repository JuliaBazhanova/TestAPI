const { test, expect } = require('@playwright/test');
const axios = require('axios');
const fs = require("fs");

// task #3
test.describe('regres.in test', () => {
    test('CRUD operations', async ({page}) => {
        const urlUsers = "https://reqres.in/api/users/";

        async function createUser() {
            let firstName = "Test";
            let lastName = "User";
            await axios.post(urlUsers, {
                firstName: firstName,
                lastName: lastName
            }).then(response => {
                expect(response.status).toEqual(201);
                expect(response.data.firstName).toEqual(firstName);
                expect(response.data.lastName).toEqual(lastName);
            }).catch(error => {
                console.log(error);
            });
        }

        async function getUser(id) {
            await axios.get(urlUsers + id.toString()
            ).then(response => {
                expect(response.status).toEqual(200);
                expect(response.data.data.id).toEqual(id);
            }).catch(error => {
                console.log(error);
            });
        }

        async function updateUser(id) {
            let name = "test";
            let job = "zion resident";
            await axios.patch(urlUsers + id.toString(), {
                "name": name,
                "job": job
            }).then(response => {
                expect(response.status).toEqual(200);
                expect(response.data.name).toEqual(name);
                expect(response.data.job).toEqual(job);
            }).catch(error => {
                console.log(error);
            });
        }

        async function deleteUser(id) {
            await axios.delete(urlUsers + id.toString()
            ).then(response => {
                expect(response.status).toEqual(204);
            }).catch(error => {
                console.log(error);
            });
        }

        let id = 12;
        await createUser();
        await getUser(id);
        await updateUser(id);
        await deleteUser(id);
    });
});

// task #4
test.describe('thecocktaildb.com test', () => {
    test('Check cocktails collection', async ({page}) => {
        console.log("Step 1. Check there is no  'bourbon' and 'whiskey' in the cocktails collection");
        console.log("Step 2. Validate all cocktail names include 'vodka'");
        console.log("Step 3. Validate every cocktail has IT instructions");
        await axios.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=vodka"
        ).then(async response => {
            expect(response.status).toEqual(200);
            response.data.drinks.forEach(function (item) {
                // verify that there is no  'bourbon' and 'whiskey' in the cocktails collection
                for (let i = 1; i <= 15; i++) {
                    let fieldName = "strIngredient" + i;
                    if (item[fieldName]) {
                        expect(item[fieldName].toLowerCase()).not.toEqual("bourbon");
                        expect(item[fieldName].toLowerCase()).not.toEqual("whiskey");
                    }
                }

                // verify that all cocktail names include 'vodka'
                expect(item.strDrink.toLowerCase()).toMatch(/vodka/);

                // verify every cocktail has IT instructions
                expect(item.strInstructionsIT).not.toEqual(null);
                expect(item.strInstructionsIT.trim).not.toEqual("");
            });

            console.log("Step 4. Validate the amount is always the same")
            // try to repeat request
            let response2 = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=vodka");
            expect(response.data.drinks.length).toEqual(response2.data.drinks.length);

            // for locally only
            /*fs.readFile('./json/count.json', 'utf8', (err, data) => {
                if (err) {
                    console.log("Error reading file from disk: ${err}");
                } else {
                    // verify count of cocktails
                    const json = JSON.parse(data);
                    const countOfItems = json.count;
                    if (countOfItems) {
                       expect(response.data.drinks.length).toEqual(countOfItems);
                    } else {
                        // save count of cocktails
                        json.count = response.data.drinks.length;
                        fs.writeFile('./json/count.json', JSON.stringify(json), 'utf8', (err) => {
                            if (err) {
                                console.log("Error writing file: ${err}");
                            } else {
                                console.log("File is written successfully!");
                            }
                        });
                    }
                }
            });*/
        }).catch(error => {
            console.log(error);
        });
    });
});

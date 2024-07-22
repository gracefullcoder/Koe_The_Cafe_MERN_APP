const mongoose = require("mongoose");
const Menu = require("../models/menu");
const Dish = require("../models/dish");
const connectDB = require("../config/dbconfig");

connectDB;
const createDish = async (dishName, description, price, tag = null) => {

    const imageUrls = ["https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-1.png?updatedAt=1720477737930",
        "https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-2.png?updatedAt=1720477738180",
        "https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-3.png?updatedAt=1720477738076",
        "https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-4.png?updatedAt=1720477738324",
        "https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-5.png?updatedAt=1720477668217",
        "https://ik.imagekit.io/vaibhav11/Koe_Cafe/menusection/menu-6.png?updatedAt=1720477737966"];
    const dishImage = imageUrls[Math.floor(Math.random() * 6)];
    const dish = new Dish({
        dishName,
        description,
        price,
        tag,
        dishImage
    });
    await dish.save();
    return dish._id;
};

const createMenu = async (title, dishIds) => {
    const menu = new Menu({
        title,
        dishes: dishIds
    });
    await menu.save();
};

const initializeMenu = async () => {
    // Soups
    const soups = await Promise.all([
        createDish("American Corn Cheddar", "Delicious corn cheddar soup", 250),
        createDish("Classic Veg Verdure Soup", "Classic vegetable soup", 270),
        createDish("Avocado Soup", "Healthy avocado soup", 320, "special"),
        createDish("Zesty Oriental Soup", "Zesty oriental flavors", 250),
        createDish("Roasted Tomato", "Rich roasted tomato soup", 300),
        createDish("Classic Almond Broccoli Soup", "Broccoli with almond", 270),
        createDish("Citrus Cilantro Soup", "Citrus cilantro flavors", 270)
    ]);
    await createMenu("Soups", soups);

    // Sides
    const sides = await Promise.all([
        createDish("French Fries", "Crispy french fries", 190),
        createDish("Peri Peri French Fries", "Spicy peri peri fries", 220),
        createDish("Cheesy French Fries", "Fries with cheese", 260),
        createDish("House Made Tossed Potato Wedges", "Homemade potato wedges", 320, "special")
    ]);
    await createMenu("Sides", sides);

    // Global Appetizers
    const appetizers = await Promise.all([
        createDish("Falafel Hummus", "Classic falafel hummus", 380),
        createDish("Mezze Platter", "Assorted mezze platter", 680, "special"),
        createDish("Classic Garlic Bread", "Garlic flavored bread", 290),
        createDish("Aranchini Balls", "Crispy aranchini balls", 410),
        createDish("Classic Bruschetta", "Tomato basil bruschetta", 380),
        createDish("Avocado Bruschetta", "Avocado topped bruschetta", 450),
        createDish("Cottage Cheese Cigar Roll", "Cheese cigar rolls", 340),
        createDish("Pesto Cottage Cheese", "Pesto flavored cheese", 360),
        createDish("Mexican Nachos", "Nachos with Mexican dip", 290),
        createDish("Quesadillas", "Cheese-filled quesadillas", 320),
        createDish("Enchilladas", "Stuffed enchilladas", 350),
        createDish("Queso Bowl with Nachos", "Nachos with queso", 350),
        createDish("Green Tacos with Pineapple Salsa & Sour Cream", "Tacos with salsa", 340),
        createDish("Classic Stuffed Mushrooms", "Stuffed mushroom caps", 390)
    ]);
    await createMenu("Global Appetizers", appetizers);

    // From the Oriental Kitchen
    const oriental = await Promise.all([
        createDish("Cottage Cheese Chilly (Dry/Gravy)", "Spicy cottage cheese", 350),
        createDish("Exotic Vegetables in Hot Garlic Sauce (Gravy)", "Vegetables in garlic sauce", 380),
        createDish("Hakka Noodles", "Flavorful Hakka noodles", 270),
        createDish("Burnt Garlic Rice", "Garlic flavored rice", 280),
        createDish("Waterchest Nut and Baby Corn in Black Pepper Sauce", "Waterchest nut and corn", 340)
    ]);
    await createMenu("From the Oriental Kitchen", oriental);

    // Pasta & Risotto
    const pasta = await Promise.all([
        createDish("Lasagne- Zucchini & Bell Pepper", "Veggie lasagne", 595, "special"),
        createDish("Lasagne- Mushroom & Asparagus", "Mushroom lasagne", 595, "special"),
        createDish("Mac & Cheese", "Cheesy macaroni", 460),
        createDish("Spaghetti Bolognese", "Classic spaghetti", 420),
        createDish("Spaghetti Aglio Olio", "Garlic olive oil spaghetti", 420),
        createDish("Classic Arabiatta", "Spicy tomato pasta", 420),
        createDish("Classic Alfredo", "Creamy Alfredo pasta", 420),
        createDish("Classic Pink Sauce Pasta", "Tomato cream pasta", 420),
        createDish("Ravioli Di Spinaci", "Spinach filled ravioli", 470),
        createDish("Mushroom Ravioli in Bell Pepper Sauce", "Mushroom ravioli", 470),
        createDish("Creamy Walnut Pesto", "Walnut pesto pasta", 420),
        createDish("Risotto Ai Funghi", "Mushroom risotto", 490)
    ]);
    await createMenu("Pasta & Risotto", pasta);

    // Rice Bowls
    const riceBowls = await Promise.all([
        createDish("Bell Pepper Herb Rice in Portobello Sauce", "Herb rice bowl", 560),
        createDish("Spinach Rice in Tandoor Sauce", "Spinach rice bowl", 560),
        createDish("Mexican Rice with Tit Bit Delight Sauce", "Mexican rice bowl", 560)
    ]);
    await createMenu("Rice Bowls", riceBowls);

    // Curries
    const curries = await Promise.all([
        createDish("Thai Green Curry with Jasmine Rice", "Green curry and rice", 590),
        createDish("Thai Red Curry with Jasmine Rice", "Red curry and rice", 590)
    ]);
    await createMenu("Curries", curries);

    // Salads
    const salads = await Promise.all([
        createDish("Greek Salad", "Classic Greek salad", 350),
        createDish("Avocado Quinoa Salad", "Avocado and quinoa", 450, "special"),
        createDish("Beetroot Orange Feta Salad with Caramelised Walnut", "Beetroot and orange", 410),
        createDish("Buddha Bowl", "Healthy Buddha bowl", 390),
        createDish("Falafel Tahini Salad", "Falafel with tahini", 410)
    ]);
    await createMenu("Salads", salads);

    // Burgers
    const burgers = await Promise.all([
        createDish("French Avocado Burger", "Avocado burger", 390),
        createDish("Cottage Cheese Steak Burger", "Cheese steak burger", 350),
        createDish("Guacamole Beans Burger", "Beans and guacamole", 390),
        createDish("Inoki Shitake Mushroom Burger", "Mushroom burger", 410),
        createDish("Veggie Burger", "Classic veggie burger", 340)
    ]);
    await createMenu("Burgers", burgers);

    // Sourdough Sandwiches
    const sandwiches = await Promise.all([
        createDish("Creamy Mushroom Feta Sandwich with Truffle Oil", "Mushroom feta sandwich", 360),
        createDish("Hummus Olive De Avocado", "Hummus and avocado", 360),
        createDish("Smoked Tomato Brie", "Tomato and brie", 350),
        createDish("California Avocado", "Avocado sandwich", 410),
        createDish("Mediterranean Cottage Cheese", "Mediterranean cheese", 390),
        createDish("Classic Bocconcini with Cherry Tomatoes & Basil", "Bocconcini sandwich", 410),
        createDish("Avocado with French Asparagus & Cheese Sandwich", "Avocado asparagus sandwich", 420)
    ]);
    await createMenu("Sourdough Sandwiches", sandwiches);

    // Croissant Sandwiches
    const croissants = await Promise.all([
        createDish("Avocado Tomato Cheese", "Avocado and cheese", 450),
        createDish("Grilled Pesto Cottage Cheese", "Grilled pesto cheese", 420),
        createDish("Mediterranean Grilled Veg", "Grilled vegetables", 410),
        createDish("Tomato Basil Burrata Sandwich", "Tomato basil burrata", 450)
    ]);
    await createMenu("Croissant Sandwiches", croissants);

    // All Day Pizza
    const pizzas = await Promise.all([
        createDish("Margherita", "Tomato, mozzarella, basil", 550),
        createDish("Carduni", "Asparagus, mushroom, broccoli", 575),
        createDish("Burrata Al Funghi", "Garlic mushroom, balsamic", 645, "special"),
        createDish("Picante", "Jalapeño, roast pepper, olives", 595),
        createDish("Melino", "Asparagus, zucchini, roast pepper", 595),
        createDish("Terre", "Baby corn, fries, zucchini", 595),
        createDish("Quattro Fromaggio", "Feta, mozzarella, parmesan", 645),
        createDish("Della Casa", "Mozzarella, lettuce, asparagus", 610),
        createDish("Peri-Peri Cottage Cheese", "Cottage cheese, bell pepper", 620),
        createDish("American Corn Pizza", "Corn, bell pepper, onion", 590),
        createDish("House of Exotic Veggies", "Zucchini, corn, broccoli", 620)
    ]);
    await createMenu("All Day Pizza", pizzas);

    // Mocktails
    const mocktails = await Promise.all([
        createDish("Blueberry Mojito", "Refreshing blueberry mojito", 220),
        createDish("Mint Mojito", "Classic mint mojito", 190),
        createDish("Bubble Gum Blast", "Sweet bubble gum flavor", 180),
        createDish("Cosmopolitan", "Cranberry lime mocktail", 250),
        createDish("Fresh Lime Soda", "Classic lime soda", 160)
    ]);
    await createMenu("Mocktails", mocktails);

    // Hot Beverages
    const hotBeverages = await Promise.all([
        createDish("Espresso Italiano", "Rich Italian espresso", 180),
        createDish("Espresso Americano", "Strong black coffee", 210),
        createDish("Honey Cinnamon Americano", "Honey and cinnamon coffee", 230),
        createDish("Cappuccino", "Classic cappuccino", 220),
        createDish("Flat White", "Smooth flat white", 240),
        createDish("Cortado", "Balanced cortado", 230),
        createDish("Café Latte (Hazelnut | Vanilla | Cinnamon | Irish)", "Flavored latte options", 270),
        createDish("Macchiato", "Espresso with milk", 220),
        createDish("Peanut Butter Latte", "Peanut butter infused latte", 270),
        createDish("Café Mocha Special", "Chocolate infused mocha", 290),
        createDish("Dark Hot Chocolate", "Rich dark hot chocolate", 290),
        createDish("Hot Nutella", "Hot drink with Nutella", 300),
        createDish("Salted Mocha", "Salted mocha coffee", 320),
        createDish("Orange Zest Mocha", "Mocha with orange zest", 320)
    ]);
    await createMenu("Hot Beverages", hotBeverages);

    // Cold Beverages
    const coldBeverages = await Promise.all([
        createDish("Iced Americano", "Chilled black coffee", 240),
        createDish("Mazagran", "Iced coffee with lemon", 260),
        createDish("Espresso Tonic", "Espresso with tonic water", 260),
        createDish("Shakerato", "Shaken iced coffee", 290),
        createDish("Caramel Iced Latte", "Caramel flavored iced latte", 290),
        createDish("Iced Mocha", "Iced chocolate coffee", 290),
        createDish("El Coco (Coconut)", "Coconut flavored drink", 290),
        createDish("Classic Cold Brew", "Smooth cold brew coffee", 210),
        createDish("Cold Brew Tonic", "Cold brew with tonic water", 260),
        createDish("Iced Pour Over", "Pour-over iced coffee", 280),
        createDish("Iced Aeropress", "Aeropress iced coffee", 290),
        createDish("Cold Brew Ginger Ale", "Ginger ale and cold brew", 280),
        createDish("Cold Fashioned - Orange", "Cold brew with orange", 280),
        createDish("Cold Brew - Cranberry", "Cranberry infused cold brew", 280),
        createDish("Cold Brew - Passion Fruit", "Passion fruit cold brew", 280),
        createDish("Frappuccino", "Blended coffee drink", 260),
        createDish("Irish Frappe", "Irish flavored frappe", 290),
        createDish("Hazelnut Frappe", "Hazelnut flavored frappe", 290),
        createDish("Brownie Mocha Frappe", "Brownie and mocha blend", 320),
        createDish("Swiss Mocha Frappe", "Swiss mocha frappe", 330),
        createDish("Snickers Shake", "Snickers flavored shake", 380, "special"),
        createDish("Lemon Ice Tea", "Refreshing lemon tea", 260),
        createDish("Peach Ice Tea", "Peach flavored ice tea", 270),
        createDish("Oreo Shake", "Oreo cookie shake", 320),
        createDish("Kitkat Shake", "Kitkat flavored shake", 330),
        createDish("Nutella Shake", "Nutella flavored shake", 360),
        createDish("Biscoff Shake", "Biscoff flavored shake", 380),
        createDish("Ferrero Rocher Frappe", "Ferrero Rocher flavored frappe", 390),
        createDish("Fruit Chillers (Strawberry | Mango | Orange | Mix Berries)", "Fruit flavored chillers", 270),
        createDish("Fruit Milk Smoothies (Strawberry | Mango | Orange | Mix Berries)", "Fruit milk smoothies", 280),
        createDish("Fruit Yogurt Smoothies (Strawberry | Mango | Orange | Mix Berries)", "Fruit yogurt smoothies", 290),
        createDish("Affogato", "Espresso with ice cream", 250),
        createDish("Signature Iced Coffee (Thai Coffee)", "Thai style iced coffee", 310),
        createDish("Bombom", "Coffee with condensed milk", 250)
    ]);
    await createMenu("Cold Beverages", coldBeverages);

    // Desserts
    const desserts = await Promise.all([
        createDish("Fresh Fruit Fondue", "Assorted fresh fruits with fondue", 750, "special"),
        createDish("New York Cheese Cake", "Classic NY cheesecake", 220),
        createDish("Strawberry Cheese Cake", "Strawberry flavored cheesecake", 240),
        createDish("Biscoff Cheese Cake", "Biscoff flavored cheesecake", 260),
        createDish("Nutella Cheese Cake", "Nutella flavored cheesecake", 260),
        createDish("Blueberry Cheese Cake", "Blueberry flavored cheesecake", 240),
        createDish("Almond Croissant", "Flaky almond croissant", 300),
        createDish("Chocolate Croissant", "Chocolate filled croissant", 320),
        createDish("Brownie with Ice Cream", "Warm brownie with ice cream", 310),
        createDish("Tiramisu", "Classic Italian tiramisu", 350),
        createDish("Apple Cinnamon Cake", "Apple and cinnamon cake", 180),
        createDish("Orange Cake", "Citrus flavored cake", 180)
    ]);
    await createMenu("Desserts", desserts);

    console.log("Database initialized successfully");
    // mongoose.connection.close();
};




module.exports = initializeMenu;


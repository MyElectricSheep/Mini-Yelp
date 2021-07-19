const db = require("../../database/client");
const {
  getOneWithRestaurantsQuery,
  getAllQuery,
  getAllWithRestaurantsQuery,
  updateOneQuery,
  deleteOneQuery,
  createOneQuery,
} = require("./city.queries");

const createOne = async (req, res, next) => {
  const { name } = req.body;
  if (!name) res.status(400).send("Please provide a valid city name");

  try {
    const { rows: cityRows } = await db.query(createOneQuery(name));
    res.send(cityRows);
  } catch (e) {
    next(e);
  }
};

const readOne = (req, res) => {
  res.json(req.resource);
};

const readOneWithRestaurants = async (req, res, next) => {
  const { id } = req.params;

  // Option 1: two separate queries:
  // const cityQuery = `
  // SELECT * FROM city
  // WHERE id=$1
  // `;

  // const restaurantsQuery = `
  // SELECT r.id AS restaurant_id,
  // r.name AS restaurant_name,
  // r.picture
  // FROM city c
  // JOIN restaurant r ON r.city_id = c.id
  // WHERE c.id=$1
  // `;

  // try {
  //   const { rows: cityRows } = await db.query(cityQuery, [id]);
  //   if (!cityRows.length) return res.status(404).send("No city with that ID");

  //   const { rows: restaurantRows } = await db.query(restaurantsQuery, [id]);

  //   res.send({
  //     city_name: cityRows[0].name,
  //     city_id: cityRows[0].id,
  //     restaurants: restaurantRows,
  //   });
  // } catch (e) {
  //   console.log({ readOneCityError: e.message });
  // }

  // Option 2: one single query aggregating restaurants data into objects:
  try {
    const { rows: cityRows } = await db.query(getOneWithRestaurantsQuery(id));
    res.json(cityRows);
  } catch (e) {
    next(e);
  }
};

const readAll = async (req, res, next) => {
  try {
    const { rows: cityRows } = await db.query(getAllQuery());
    res.json(cityRows);
  } catch (e) {
    next(e);
  }
};

const readAllWithRestaurants = async (req, res, next) => {
  try {
    const { rows: cityRowsWithRestaurants } = await db.query(
      getAllWithRestaurantsQuery()
    );
    res.json(cityRowsWithRestaurants);
  } catch (e) {
    next(e);
  }
};

const updateOne = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || !id)
    res
      .status(400)
      .send("Please provide necessary id and name to update a city");
  try {
    const { rows: cityRows } = await db.query(updateOneQuery(name, id));
    res.send(cityRows);
  } catch (e) {
    next(e);
  }
};

const deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows: cityRows } = await db.query(deleteOneQuery(id));
    res.send(cityRows);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createOne,
  readOne,
  readOneWithRestaurants,
  readAll,
  readAllWithRestaurants,
  updateOne,
  deleteOne,
};

const db = require("../dabatase/client");

module.exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name) res.status(400).send("Please provide a valid city name");

  try {
    const {
      rows: cityRows,
    } = await db.query("INSERT INTO city (name) VALUES ($1) RETURNING *", [
      name,
    ]);
    res.send(cityRows);
  } catch (e) {
    console.log({ createCityError: e.message });
  }
};

module.exports.readOne = async (req, res) => {
  const { id } = req.params;
  if (!id)
    res
      .status(400)
      .send("Please provide an id to read the information about a city");

  const cityQuery = `
  SELECT * FROM city
  WHERE id=$1
  `;

  const restaurantsQuery = `
  SELECT r.id AS restaurant_id,
  r.name AS restaurant_name,
  r.picture
  FROM city c
  JOIN restaurant r ON r.city_id = c.id
  WHERE c.id=$1
  `;

  try {
    const { rows: cityRows } = await db.query(cityQuery, [id]);
    if (!cityRows.length) return res.status(404).send("No city with that ID");

    const { rows: restaurantRows } = await db.query(restaurantsQuery, [id]);

    res.send({
      city_name: cityRows[0].name,
      city_id: cityRows[0].id,
      restaurants: restaurantRows,
    });
  } catch (e) {
    console.log({ readOneCityError: e.message });
  }
};

module.exports.readAll = async (req, res) => {
  try {
    const { rows: cityRows } = await db.query("SELECT * FROM city");
    res.send(cityRows);
  } catch (e) {
    console.log({ readAllCityError: e.message });
  }
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || !id)
    res
      .status(400)
      .send("Please provide necessary id and name to update a city");
  try {
    const {
      rows: cityRows,
    } = await db.query("UPDATE city SET name=$1 WHERE id=$2 RETURNING *", [
      name,
      id,
    ]);
    res.send(cityRows);
  } catch (e) {
    console.log({ updateCityError: e.message });
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      rows: cityRows,
    } = await db.query("DELETE FROM city WHERE id=$1 RETURNING *", [id]);
    res.send(cityRows);
  } catch (e) {
    console.log({ deleteCityError: e.message });
  }
};

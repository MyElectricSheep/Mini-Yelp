const db = require("../dabatase/client");

const create = async (req, res, next) => {
  const { name } = req.body;
  if (!name) res.status(400).send("Please provide a valid city name");

  try {
    const { rows: cityRows } = await db.query(
      "INSERT INTO city (name) VALUES ($1) RETURNING *",
      [name]
    );
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
  if (!id)
    res
      .status(400)
      .send("Please provide an id to read the information about a city");

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
  const cityQuery = {
    text: `
    SELECT 
      c.id,
      c.name,
      CASE
      WHEN MAX(r.id) IS NOT NULL THEN
        ARRAY_TO_JSON(
          ARRAY_AGG(
            JSON_STRIP_NULLS(
              JSON_BUILD_OBJECT(
                'id', r.id,
                'name', r.name,
                'picture', r.picture
              )
            )
          )
        )
      ELSE
       '[]'::json
    END as restaurants
    FROM city c
      LEFT JOIN restaurant r
      ON r.city_id = c.id
    WHERE c.id=$1
    GROUP BY c.id, c.name
    `,
    values: [id],
  };

  try {
    const { rows: cityRows } = await db.query(cityQuery);
    res.json(cityRows);
  } catch (e) {
    next(e);
  }
};

const readAll = async (req, res, next) => {
  try {
    const { rows: cityRows } = await db.query("SELECT * FROM city");
    res.json(cityRows);
  } catch (e) {
    next(e);
  }
};

const readAllWithRestaurants = async (req, res, next) => {
  try {
    const citiesQueryWithRestaurants = `
  SELECT 
    c.id,
    c.name,
    ARRAY_AGG(
      JSON_BUILD_OBJECT(
        'id', r.id,
        'name', r.name,
        'picture', r.picture
        )
      ) AS restaurants
  FROM city c
    JOIN restaurant r
    ON r.city_id = c.id
  GROUP BY c.id, c.name
  `;
    const { rows: cityRowsWithRestaurants } = await db.query(
      citiesQueryWithRestaurants
    );
    res.json(cityRowsWithRestaurants);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name || !id)
    res
      .status(400)
      .send("Please provide necessary id and name to update a city");
  try {
    const { rows: cityRows } = await db.query(
      "UPDATE city SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );
    res.send(cityRows);
  } catch (e) {
    next(e);
  }
};

const deleteOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows: cityRows } = await db.query(
      "DELETE FROM city WHERE id=$1 RETURNING *",
      [id]
    );
    res.send(cityRows);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  create,
  readOne,
  readOneWithRestaurants,
  readAll,
  readAllWithRestaurants,
  update,
  deleteOne,
};

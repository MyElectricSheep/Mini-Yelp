const db = require("../dabatase/client");
const { oneWithCommentsAndTags } = require("../queries/restaurantQueries");

const create = async (req, res) => {
  const { name, picture, city_id } = req.body;

  if (!name || !picture || !city_id)
    return res
      .status(400)
      .send("Please provide a name, a picture and a city id");

  try {
    const cityQuery = `
    SELECT * FROM city
    WHERE id=$1
    `;

    const { rows: cityRows } = await db.query(cityQuery, [city_id]);
    if (!cityRows.length)
      return res
        .status(404)
        .send("The restaurant need to be associated with a valid city");

    const restaurantQuery = `
    INSERT INTO restaurant (name, picture, city_id)
    VALUES ($1, $2, $3) 
    RETURNING *
    `;

    const { rows: restaurantRows } = await db.query(restaurantQuery, [
      name,
      picture,
      city_id,
    ]);
    res.send(restaurantRows);
  } catch (e) {
    console.log({ createCityError: e.message });
  }
};

const readRestaurant = async (id) => {
  const restaurantQuery = `
      SELECT r.id AS restaurant_id, r.name AS restaurant_name, r.picture, ct.name AS city_name, ct.id AS city_id
      FROM restaurant r
      JOIN city ct ON ct.id = r.city_id
      WHERE r.id=$1
      `;
  try {
    const { rows: restaurantRows } = await db.query(restaurantQuery, [id]);
    return restaurantRows;
  } catch (e) {
    next(e);
  }
};

const readComments = async (id) => {
  const commentsQuery = `
      SELECT cm.id, cm.comment
      FROM comment cm
      JOIN restaurant r ON r.id = cm.restaurant_id
      WHERE r.id=$1
      `;
  try {
    const { rows: commentRows } = await db.query(commentsQuery, [id]);
    return commentRows;
  } catch (e) {
    console.log({ readCommentsError: e.message });
  }
};

const readTags = async (id) => {
  const tagsQuery = `
      SELECT t.id, t.name
      FROM tag t
      JOIN restaurant_has_tag rht ON t.id = rht.tag_id
      JOIN restaurant r ON rht.restaurant_id = r.id
      WHERE r.id=$1
      `;
  try {
    const { rows: tagRows } = await db.query(tagsQuery, [id]);
    return tagRows;
  } catch (e) {
    console.log({ readCommentsError: e.message });
  }
};

// Solution 2: split the queries (less efficient, but more control)
// const readOne = async (req, res) => {
//   const { id } = req.params;

//   const restaurantData = await readRestaurant(id);

//   res.send({
//     ...restaurantData["0"],
//     comments: await readComments(id),
//     tags: await readTags(id),
//   });

const readOne = async (req, res, next) => {
  const { id } = req.params;
  // Solution 1: single SQL query (more efficient, more complex)
  try {
    const { rows: oneRestaurantRows } = await db.query(
      oneWithCommentsAndTags(id)
    );
    res.json(oneRestaurantRows);
  } catch (e) {
    next(e);
  }
};

const readAll = async (req, res) => {
  const { limit = 10, offset = 0, comments = true, tags = true } = req.body;

  try {
    const { rows: restaurantRows } = await db.query("SELECT * FROM restaurant");

    const allRestaurantsPromises = restaurantRows
      .slice(offset, limit)
      .map(async (restaurant) => {
        const { id } = restaurant;
        const restaurantData = await readRestaurant(id);
        const commentsData = comments && (await readComments(id));
        const tagsData = tags && (await readTags(id));
        return {
          ...restaurantData["0"],
          comments: commentsData ? commentsData : "Not requested",
          tags: tagsData ? tagsData : "Not requested",
        };
      });

    Promise.all(allRestaurantsPromises).then((data) => {
      // Timing: ~6.789ms to retrieve all restaurants data
      res.send(data);
    });
  } catch (e) {
    console.log({ readAllRestaurantsError: e.message });
  }
};

const update = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will update a specific restaurant", id);
};

const deleteOne = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will delete a specific restaurant", id);
};

module.exports = {
  create,
  readRestaurant,
  readComments,
  readTags,
  readOne,
  readAll,
  update,
  deleteOne,
};

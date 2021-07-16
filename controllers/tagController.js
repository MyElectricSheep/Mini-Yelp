const db = require("../database/client");

module.exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name) res.status(400).send("Please provide a valid tag name");

  const getAllTagsQuery = `
    SELECT * FROM tag;
  `;

  const createTagQuery = `
    INSERT INTO tag (name) 
    VALUES ($1) RETURNING *;
  `;

  try {
    const { rows: allTagsRow } = await db.query(getAllTagsQuery);
    if (allTagsRow.find((tag) => tag.name === name))
      return res.status(400).send("This tag already exists");

    const { rows: tagRows } = await db.query(createTagQuery, [name]);
    res.send(tagRows);
  } catch (e) {
    console.log({ createTagError: e.message });
  }
};

const tagsRestaurant = async (id) => {
  const tagRestaurantQuery = `
    SELECT
    r.name AS restaurant_name,
    r.id AS restaurant_id,
    r.city_id
    FROM tag t
    JOIN restaurant_has_tag rht ON t.id = rht.tag_id
    JOIN restaurant r ON r.id = rht.restaurant_id
    WHERE t.id=$1
    `;
  try {
    const { rows: tagRestaurantRows } = await db.query(tagRestaurantQuery, [
      id,
    ]);
    return tagRestaurantRows;
  } catch (e) {
    console.log({ tagsRestaurantError: e.message });
  }
};

module.exports.readOne = async (req, res) => {
  const { id } = req.params;
  if (!id) res.status(400).send("Please provide an id to read a tag");

  const tagQuery = `
    SELECT * FROM tag WHERE id=$1
    `;

  try {
    const { rows: tagRows } = await db.query(tagQuery, [id]);
    if (!tagRows.length) return res.status(404).send("No tag with that ID");

    res.send({
      ...tagRows["0"],
      restaurants: await tagsRestaurant(id),
    });
  } catch (e) {
    console.log({ readOneTagError: e.message });
  }
};

module.exports.readAll = async (req, res) => {
  try {
    const { rows: tagRows } = await db.query("SELECT * FROM tag");

    const allTagsPromises = tagRows.map(async (tag) => {
      const { id } = tag;
      return {
        ...tag,
        restaurants: await tagsRestaurant(id),
      };
    });

    Promise.all(allTagsPromises).then((data) => {
      res.send(data);
    });
  } catch (e) {
    console.log({ readAllTagsError: e.message });
  }
};

module.exports.update = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will update a specific tag", id);
};

module.exports.delete = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will delete a specific tag", id);
};

const db = require("../../database/client");
const {
  createTagQuery,
  getAllTagsQuery,
  getRestaurantsLinkedToATagQuery,
} = require("./tagQueries");

const create = async (req, res, next) => {
  const { name } = req.body;
  if (!name) res.status(400).send("Please provide a valid tag name");

  try {
    const { rows: tagRows } = await db.query(createTagQuery(name));
    res.send(tagRows);
  } catch (e) {
    next(e);
  }
};

const tagsRestaurant = async (id) => {
  try {
    const { rows: tagRestaurantRows } = await db.query(
      getRestaurantsLinkedToATagQuery(id)
    );
    return tagRestaurantRows;
  } catch (e) {
    console.log({ tagsRestaurantError: e.message });
  }
};

const readOne = async (req, res, next) => {
  const { id } = req.params;
  try {
    res.send({
      ...req.resource["0"],
      restaurants: await tagsRestaurant(id),
    });
  } catch (e) {
    next(e);
  }
};

const readAll = async (req, res, next) => {
  try {
    const { rows: tagRows } = await db.query(getAllTagsQuery);

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
    next(e);
  }
};

const update = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will update a specific tag", id);
};

const deleteOne = async (req, res) => {
  // To do - Not required in the exercise
  const { id } = req.params;
  res.send("This endpoint will delete a specific tag", id);
};

module.exports = {
  create,
  readOne,
  readAll,
  update,
  deleteOne,
};

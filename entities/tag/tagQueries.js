const createTagQuery = (name) => ({
  text: `
INSERT INTO tag (name) 
VALUES ($1) RETURNING *;
`,
  values: [name],
});

const getOneTagQuery = (id) => ({
  text: `
    SELECT * FROM tag WHERE id=$1
    `,
  values: [id],
});

const getAllTagsQuery = "SELECT * FROM tag";

const getRestaurantsLinkedToATagQuery = (id) => ({
  text: `
    SELECT
    r.name AS restaurant_name,
    r.id AS restaurant_id,
    r.city_id
    FROM tag t
    JOIN restaurant_has_tag rht ON t.id = rht.tag_id
    JOIN restaurant r ON r.id = rht.restaurant_id
    WHERE t.id=$1
    `,
  values: [id],
});

module.exports = {
  createTagQuery,
  getOneTagQuery,
  getAllTagsQuery,
  getRestaurantsLinkedToATagQuery,
};

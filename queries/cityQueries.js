const getAllWithRestaurantsQuery = () => ({
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
                'picture', r.picture,
                'geolocation', r.geolocation
              )
            )
          )
        )
      ELSE
       '[]'::json
    END as restaurants
  FROM city c
    JOIN restaurant r
    ON r.city_id = c.id
  GROUP BY c.id, c.name
  `,
});

const getOneWithRestaurantsQuery = (id) => ({
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
                'picture', r.picture,
                'geolocation', r.geolocation
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
});

const getAllQuery = () => ({ text: "SELECT * FROM city" });

const updateOneQuery = (name, id) => ({
  text: "UPDATE city SET name=$1 WHERE id=$2 RETURNING *",
  values: [name, id],
});

const deleteOneQuery = (id) => ({
  text: "DELETE FROM city WHERE id=$1 RETURNING *",
  values: [id],
});

module.exports = {
  getOneWithRestaurantsQuery,
  getAllQuery,
  getAllWithRestaurantsQuery,
  updateOneQuery,
  deleteOneQuery,
};

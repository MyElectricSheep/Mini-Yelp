const getOneWithCommentsAndTagsQuery = (id) => ({
  text: `
    SELECT 
      r.id AS restaurant_id,
      r.name AS restaurant_name,
      r.picture,
      r.geolocation,
      ct.name AS city_name,
      ct.id AS city_id,
      CASE
        WHEN MAX(cm.id) IS NOT NULL THEN
          ARRAY_TO_JSON(
            ARRAY_AGG(
              JSON_STRIP_NULLS(
                JSON_BUILD_OBJECT(
                  'id', cm.id,
                  'comment', cm.comment
                )
              )
            )
          )
        ELSE
         '[]'::json
      END as comments,
      CASE
        WHEN MAX(t.id) IS NOT NULL THEN
          ARRAY_TO_JSON(
            ARRAY_AGG(
              JSON_STRIP_NULLS(
                JSON_BUILD_OBJECT(
                  'id', t.id,
                  'name', t.name
                )
              )
            )
          )
        ELSE
         '[]'::json
      END as tags
    FROM restaurant r 
    LEFT JOIN city ct 
      ON ct.id = r.city_id
    LEFT JOIN comment cm
      ON cm.restaurant_id = r.id
    LEFT JOIN restaurant_has_tag rht
      ON rht.restaurant_id = r.id
    LEFT JOIN tag t
      ON t.id = rht.tag_id 
    WHERE r.id=$1
    GROUP BY r.id, ct.name, ct.id
  `,
  values: [id],
});

const createOneQuery = (name, picture, city_id, longitude, latitude) => ({
  text: `
INSERT INTO restaurant (name, picture, city_id, geolocation)
VALUES ($1, $2, $3, POINT($4, $5)) 
RETURNING *
`,
  values: [name, picture, city_id, longitude, latitude],
});

module.exports = { getOneWithCommentsAndTagsQuery, createOneQuery };

var util = require('util');
var express = require('express');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var router = express.Router();

router.post('/:id', async (req, res) => {
  let id = req.params.id;
  let statistics = req.body;

  const query = `INSERT INTO statistics(
     id,
     points_ratio_easy, points_ratio_normal, points_ratio_hard, points_ratio_nightmare,
     bombs_easy, bombs_normal, bombs_hard, bombs_nightmare, 
     obstacles_easy, obstacles_normal, obstacles_hard, obstacles_nightmare, 
     ranking_easy, ranking_normal, ranking_hard, ranking_nightmare, 
     finished, played) 
     VALUES(
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`

  const values = [
    id,
    statistics.points_ratio_easy, statistics.points_ratio_normal, statistics.points_ratio_hard, statistics.points_ratio_nightmare,
    statistics.bombs_easy, statistics.bombs_normal, statistics.bombs_hard, statistics.bombs_nightmare,
    statistics.obstacles_easy, statistics.obstacles_normal, statistics.obstacles_hard, statistics.obstacles_nightmare,
    statistics.ranking_easy, statistics.ranking_normal, statistics.ranking_hard, statistics.ranking_nightmare,
    statistics.finished, statistics.played
  ]

  try {
    const client = await pool.connect()
    const res = await pool.query(query, values)
    res.json({
      message: "Succesfully updated data"
    });
    client.release();
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

router.put('/', async (req, res) => {
  let statistics = req.body;

  const query = `INSERT INTO statistics(
     points_ratio_easy, points_ratio_normal, points_ratio_hard, points_ratio_nightmare,
     bombs_easy, bombs_normal, bombs_hard, bombs_nightmare, 
     obstacles_easy, obstacles_normal, obstacles_hard, obstacles_nightmare, 
     ranking_easy, ranking_normal, ranking_hard, ranking_nightmare, 
     finished,played) 
     VALUES(
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`

  const values = [
    statistics.points_ratio_easy, statistics.points_ratio_normal, statistics.points_ratio_hard, statistics.points_ratio_nightmare,
    statistics.bombs_easy, statistics.bombs_normal, statistics.bombs_hard, statistics.bombs_nightmare,
    statistics.obstacles_easy, statistics.obstacles_normal, statistics.obstacles_hard, statistics.obstacles_nightmare,
    statistics.ranking_easy, statistics.ranking_normal, statistics.ranking_hard, statistics.ranking_nightmare,
    statistics.finished, statistics.played
  ]

  try {
    const client = await pool.connect()
    const res = await pool.query(query, values)
    res.json({
      message: "Succesfully updated data",
      id: res.fields[0]
    });
    client.release();
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

router.get('/', async (req, res) => {
  const query = `SELECT 
  AVG(points_ratio_easy), AVG(points_ratio_normal),AVG(points_ratio_hard),AVG(points_ratio_nightmare),
  AVG(bombs_easy),AVG(bombs_normal),AVG(bombs_hard),AVG(bombs_nightmare),
  AVG(obstacles_easy),AVG(obstacles_normal),AVG(obstacles_hard),AVG(obstacles_nightmare),
  AVG(ranking_easy),AVG(ranking_normal),AVG(ranking_hard),AVG(ranking_nightmare),
  AVG(finished),AVG(played) FROM statistics`

  try {
    const client = await pool.connect()
    const result = await pool.query(query)
    res.json({
      message: "Succesfully updated data",
      result: result
    });
    client.release();
  } catch (err) {
    res.json({
      error: err.message
    });
  }
});

module.exports = router;

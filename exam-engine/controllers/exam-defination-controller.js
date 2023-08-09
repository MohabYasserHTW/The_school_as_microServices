const pool = require("../db");
const queries = require("../queries/examdef-queries");
const queriesExamInstance = require("../queries/examinstance-queries");
const HttpError = require("../models/httpError-model");
const { ErrorsMessages } = require("../variables");

const getExamsDefinations = (req, res, next) => {
  const { filters } = req.query;

  if (filters) {
    var filterValues = Object.keys(filters).map(function (key) {
      return filters[key];
    });
    
    pool
      .query(
        filterValues?.length ? queries.getAllByFilters(filters) : queries.getAll,
        filterValues
      )
      .then((results) => {
        if (!results.rowCount) {
          res.status(200).json([]);
        } else {
          res.status(200).json(results.rows);
        }
      })
      .catch((err) => {
        
        return next(new HttpError(ErrorsMessages.failedToGetTheData, 501));
      });
  }
};

const getExamDefinationById = (req, res, next) => {
  const { id } = req.params;
  
  pool
    .query(queries.getById, [id])
    .then((results) => {
      if (!results.rowCount) {
        return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 501));
      } else {
        res.status(200).json(results.rows[0]);
      }
    })
    .catch((err) => {
      throw next(new HttpError(err, 501));
    });
};

const deleteExamDefinationById = (req, res, next) => {
  const {id} = req.params;

  pool
    .query(queries.getById, [id])
    .then((result) => {
      if (!result.rowCount) {
        return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
      }

      pool
        .query(queriesExamInstance.deleteWithExamDefId, [id])
        .then((result) => {
          pool
            .query(queries.deleteById, [id])
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => next(new HttpError(err, 501)));
        })
        .catch((err) => next(new HttpError(err, 501)));
    })
    .catch((err) => next(new HttpError(err, 501)));
};

const addExamDefination = (req, res, next) => {
  const exam = req.body;
  const userData = req.userData;

  pool
    .query(queries.addDef, [
      exam.name,
      exam.passing_score | 50,
      exam.questions,
      userData.userId,
    ])
    .then((result) => {
      res.status(201).json("Created successfully !");
    })
    .catch((err) => next(new HttpError(err, 501)));
};

const updateExamDefination = (req, res, next) => {
  const {id} = req.params;
  const { name } = req.body;

  pool
    .query(queries.getById, [id])
    .then((result) => {
      if (!result.rowCount) {
        return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
      }
      pool
        .query(queries.updateDefName, [name, id])
        .then((result) => {
          res.status(200).json("Updated");
        })
        .catch((err) => next(new HttpError(err, 501)));
    })
    .catch((err) => next(new HttpError(err, 501)));
};

module.exports = {
  getExamsDefinations,
  getExamDefinationById,
  deleteExamDefinationById,
  addExamDefination,
  updateExamDefination,
};

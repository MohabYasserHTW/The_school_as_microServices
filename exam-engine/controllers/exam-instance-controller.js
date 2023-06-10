const queries = require("../queries/examinstance-queries");
const HttpError = require("../models/httpError-model");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const { ErrorsMessages, Success } = require("../variables");
require('dotenv').config();

const getAllExamInstance = (req, res, next) => {
  const { filters } = req.query;

  if (filters) {
    var filtersValues = Object.keys(filters).map(function (key) {
      return filters[key];
    });
  }
  
  pool
    .query(
      filtersValues?.length
        ? queries.getExamInstances(filters)
        : queries.getAllExamInstances,
      filtersValues
    )
    .then((result) => {
      if (!result.rowCount) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result.rows);
      }
    })
    .catch((err) => {
      next(new HttpError(err, 500));
    });
};

const getExamInstanceById = (req, res, next) => {
  const { id } = req.params;
  
  pool
    .query(queries.getExamInstanceById, [id])
    .then((result) => {
      if (!result.rowCount) {
        return next(new HttpError(ErrorsMessages.failedToGetTheData, 500));
      }
      res.status(200).json(result.rows);
    })
    .catch((err) => next(new HttpError(err, 500)));
};

const addExamInstance = (req, res, next) => {
  const { examDifId, generatedLink, createdBy, takenBy } = req.body;

  if (!examDifId || !generatedLink || !createdBy || !takenBy) {
    return next(new HttpError(ErrorsMessages.missingValues, 400));
  }
  if (
    !generatedLink.scheduleTimeFrom ||
    !generatedLink.scheduleTimeTo ||
    !generatedLink.url
  ) {
    return next(new HttpError(ErrorsMessages.missingValues, 400));
  }

  pool
    .query(queries.addExamInstance, [
      examDifId,
      generatedLink,
      createdBy,
      takenBy,
      "absent" ,
    ])
    .then((result) => res.send(Success.created).status(201))
    .catch((err) => next(new HttpError(err, 501)));
};

const deleteExamInstance = (req, res, next) => {
  const id = req.params.id;

  pool
    .query(queries.getExamInstanceById, [id])
    .then((result) => {
      if (!result.rowCount) {
        return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
      }

      pool
        .query(queries.deleteById, [id])
        .then((result) => {
          res.status(200).send(Success.deleted);
        })
        .catch((err) => next(new HttpError(err, 501)));
    })
    .catch((err) => next(new HttpError(err, 501)));
};

const updateExamInstancetByID = (req, res, next) => {
  const { id } = req.params;
  const { filters } = req.body;
  const { userData } = req;

  if (filters) {
    var filtersValues = Object.keys(filters).map(function (key) {
      if (key === "questions") {
        return JSON.stringify(filters[key]);
      } else {
        return filters[key];
      }
    });
  }
  console.log(process.env.EXAM_TOKEN_SECRET)
  //we have 2 types of updates
  // 1- teacher update not allowed to update the questions on the exam instance and not allowed to update qstatus
  // 2- student can only update the questions of exam instance and qstatus

  if (userData?.userType === "STUDENT") {
    let isLegal;
    isLegal = Object.keys(filters).map((key) => {
      if (key !== "qstatus" && key !== "questions") {
        return false;
      } else {
        pool
    .query(queries.getExamInstanceById, [id])
    .then((result) => {
      if(result.rows[0].questions?.length >0){
        next(new HttpError(ErrorsMessages.cannotSubmit,400))
      }
    })
        return true;
      }
    });

    if (isLegal.includes(false)) {
      next(
        new HttpError(ErrorsMessages.forbbiden, 403)
      );
    }
  } else if (userData?.userType === "TEACHER") {
    let isLegal;
    isLegal = Object.keys(filters).map((key) => {
      if (key !== "qstatus" && key !== "questions") {
        return true;
      } else {
        return false;
      }
    });
    if (isLegal.includes(false)) {
      next(
        new HttpError(ErrorsMessages.forbbiden, 403)
      );
    }
  }

  pool
    .query(queries.getExamInstanceById, [id])
    .then((result) => {
      if (!result.rowCount) {
        return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
      }

      if (userData.userType === "STUDENT") {
        if (userData.userId !== result.rows[0].takenby) {
          return next(
            new HttpError(ErrorsMessages.forbbiden, 403)
          );
        }
      }

      pool
        .query(queries.updateExamInstancetByID(id, filters), filtersValues)
        .then((result) => {
          if (Object.keys(filters).includes("qstatus")) {
            let token;
            
            try {
              token = jwt.sign(
                {
                  userId:userData.userId 
                },
                process.env.EXAM_TOKEN_SECRET
              );
            } catch (err) {
              console.log(err)
              return next(new HttpError(ErrorsMessages.failedToCreateToken, 500));
            }
            res.status(200).json({examToken:token})
          }else{
            res.status(200).json(Success.updated);
          }
          
        })
        .catch((err) => next(new HttpError(err, 501)));
    })
    .catch((err) => next(new HttpError(err, 501)));
};

module.exports = {
  addExamInstance,
  getAllExamInstance,
  getExamInstanceById,
  deleteExamInstance,
  updateExamInstancetByID,
};

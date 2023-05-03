const HttpError = require("../models/http-error")
const { v4: uuid } = require('uuid');
const {validationResult} = require("express-validator")

let DUMMY_PLACES = [
    {
      id: uuid(),
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      location: {
        lat: 40.7484474,
        lng: -73.9871516
      },
      address: '20 W 34th St, New York, NY 10001',
      creator: 'u1'
    }
  ];


const getPlaceByPlaceId = (req,res,next)=>{
    const placeId = req.params.pid
    const foundedPlace = DUMMY_PLACES.find(p => p.id === placeId)

    if(!foundedPlace){
        const error = new HttpError("Could not find a place using page id", 404)
        throw error // it will make error handeler middleware work now 
    }

    res.json({place:foundedPlace})
}

const getPlacesByUserId = (req,res,next)=>{
    const userId = req.params.uid
    const foundedPlace = DUMMY_PLACES.filter(p => p.creator === userId)

    if(!foundedPlace || foundedPlace.length){
        const error = new HttpError("Could not find a place using user id", 404)
        /* error.code = 404 */ //got cancled after creating our new httpError class instead of Erro
        return next(error) // it will make error handeler middleware work now but its diffrent from threw when it have async func 
    }

    res.json({place:foundedPlace})
}

const createPlace = (req,res,next)=>{
    const errors = validationResult(req) //check if their is errors depends on the check methods on the routes
    if(!errors.isEmpty()){
        throw new HttpError("invalid inputs values ",422)
    }

    const {title,description,coordinates,address,creator} = req.body

    const createdPlace={title,description,location:coordinates,address,creator}

    DUMMY_PLACES.push(createdPlace)

    res.status(201).json(createdPlace)
}

const updatePlaceById = (req,res,next)=>{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
    const {title,description,coordinates,address,creator} = req.body
    const pid = req.params.pid
    
    const foundedPlace = DUMMY_PLACES.find(p => p.id === pid)

    foundedPlace.title = title //objects are references 
    foundedPlace.description = description
    
    res.status(200).json(foundedPlace)
}

const deletePlace = (req,res,next)=>{
    const pid = req.params.pid

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== pid)

    res.status(200).json(DUMMY_PLACES)
}





exports.getPlaceByPlaceId = getPlaceByPlaceId
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlace = deletePlace
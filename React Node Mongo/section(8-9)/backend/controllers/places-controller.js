const HttpError = require("../models/http-error")

const {validationResult} = require("express-validator")
const Place = require("../models/place")
const User = require("../models/user");
const { default: mongoose } = require("mongoose");



const getPlaceByPlaceId = async (req,res,next)=>{
    const placeId = req.params.pid
    let foundedPlace
    try{
       foundedPlace = await Place.findById(placeId)
    }catch(err){
      const e = new HttpError("something went wrong while trying to find place using place id ",500)
      return next(e)
    }
    if(!foundedPlace){
        const error = new HttpError("Could not find a place using page id", 404)
        return next(error) // it will make error handeler middleware work now 
    }

    res.json({place:foundedPlace.toObject({getters:true})})
}

const getPlacesByUserId = async (req,res,next)=>{
    const userId = req.params.uid
    let foundedPlaces
    
    try{
      foundedPlaces = await Place.find({creator:userId})
    }catch(err){
      const e = new HttpError("something went wrong while trying to get place by userId",500)
      return next(e)
    }
    

    if(!foundedPlaces || !foundedPlaces.length){
        const error = new HttpError("Could not find a place using user id", 404)
        /* error.code = 404 */ //got cancled after creating our new httpError class instead of Erro
        return next(error) // it will make error handeler middleware work now but its diffrent from threw when it have async func 
    }

    res.json({places:foundedPlaces.map(p=>p.toObject())})
}

const createPlace = async (req,res,next)=>{
    const errors = validationResult(req) //check if their is errors depends on the check methods on the routes
    if(!errors.isEmpty()){
        throw new HttpError("invalid inputs values ",422)
    }

    const {title,description,coordinates,address,creator} = req.body

    const createdPlace = new Place(
      {
        title,
        description,
        location:coordinates,
        image:"https://media.licdn.com/dms/image/D4D03AQFPSFU_DtUuCQ/profile-displayphoto-shrink_800_800/0/1678789074545?e=2147483647&v=beta&t=NzQhpYaMSiO9S3_4y3ylUl4JiV_jDz0FD6MPDgyRJgU",
        address,
        creator
      })
    
      let user

      try{
        user = await User.findById(creator)
      }catch{
        return next(new HttpError("somthing went wrong while trying to find the user ",500))
      }

    if(!user){
      return next(new HttpError("couldn't find user with this id",404))
    }

    try{//seesion transaction operations (this is used when you want to do requests to the db that depends on each other if one fails the other not commited)
      const sess = await mongoose.startSession()
      sess.startTransaction()
      
      await createdPlace.save({session:sess})
      user.places.push(createdPlace)
      await user.save({session:sess})

      await sess.commitTransaction()//now if the upper operations done successfully commit them 
      //transactions need to have a collection it doesnt create them as usual
    }catch(err){
      const error = new HttpError("couldn't create a new place on the db ",500)
      return next(error) //return to prevent the code from execution and to go to the app.use(err)
    }
    
    res.status(201).json(createdPlace)
}

const updatePlaceById = async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
}

const deletePlace = async (req,res,next)=>{
    const pid = req.params.pid
    let place 
    try{
        place = await Place.findById(pid).populate("creator")//populate is usable now cause we created ref on both schemas (u will find this place id also in creator field in User)
    }catch(err){
      const e = new HttpError("couldn't find this place using place id",404)
      return next(e)
    }
    
    if(!place){
      return new HttpError("couldn't find place with this id ",404)
    }

    try{
      const sess = await mongoose.startSession()
      sess.startTransaction()

      await place.deleteOne({session:sess})
      place.creator//this refrence to the creator object 
      .places.pull(place)//go to places array and pull this place
      await place.creator.save({session:sess})

      await sess.commitTransaction()
      /* const result = await place.deleteOne() */
    }catch(err){
      const e = new HttpError("something went wrong while deleting this place using place id",500)
      return next(e)
    }

    res.status(200).json({place})
}





exports.getPlaceByPlaceId = getPlaceByPlaceId
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlaceById = updatePlaceById
exports.deletePlace = deletePlace
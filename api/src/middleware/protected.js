const jwt = require('jsonwebtoken')
const moment = require('moment')
const authConfig =require('../config/auth');
const {User} = require('../db.js')

exports.isAuthAdmin = async function(req,res,next){
    if(!req.headers.authorization){
        console.log('no llega el auth de admin')
        return res.status(403).send({message:'No tienes autorización'})
    }
    const token =req.headers.authorization.split(" ")[1]
    const payload = jwt.decode(token,authConfig.secret)
    let user = await User.findOne({where:{id:payload.id}})
    if(user.rol !== 'admin'){
        console.log('debes ser admin rol')
        return res.status(403).send({message:'No tienes autorización'})
    }   
    if (payload.exp <= moment().unix()){
        return res.status(401).send({message:'El Token ha expirado'})        
    }
    req.user=payload.sub
    next()

}
exports.isAuth = async function(req,res,next){
     if(!req.headers.authorization){
        console.log('no llega el auth')
         console.log('No tienes autorización')
         return res.status(403).send({message:'No tienes autorización'})
     }
     const token =req.headers.authorization.split(" ")[1]
     const payload = jwt.decode(token,authConfig.secret)
     if (payload.exp <= moment().unix()){
         return res.status(401).send({message:'El Token ha expirado'})        
     }
     req.user=payload.sub
     next()
 
 }
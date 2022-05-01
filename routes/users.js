const { response } = require('express');
var express = require('express');
const isEligibleRequest = require('express-fileupload/lib/isEligibleRequest');
const productHelpers = require('../helper/product-helpers');
var router = express.Router();
var productHelper=require('../helper/product-helpers')
const userHelpers=require('../helper/user-helpers')
const veryfyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  console.log(user)
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{products,user})
  })
  
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else
  res.render('user/login',{"loginEr":req.session.loginErr})
  req.session.loginErr=false
})
router.get('/signup',(req,res)=>{ 
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn=true
    req.session.user=response
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      // req.session.loginErr=true
      req.session.loginErr="Invalid username and password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',veryfyLogin,(req,res)=>{
  res.render('user/cart')
})
router.get('/add-to-cart/:id',veryfyLogin,(req,res)=>{
userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
  res.redirect('/')
})
})

module.exports = router;

module.exports = (req,res,next) => {
    console.log(req.session.userLogin);
    if(!req.session.userLogin){
        return res.redirect('/user/login')
       }
       next()
}
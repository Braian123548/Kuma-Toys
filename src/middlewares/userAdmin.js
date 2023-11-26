module.exports = (req,res,next) => {
    console.log(req.session.userAdmin);
    if(!req.session.userAdmin){
        return res.redirect('/user/login')
       }
       next()
}
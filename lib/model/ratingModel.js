
exports.newRating = function(req){
  var rating = {
    id : req.params.id,
    username : req._passport.session.user,
    updated_at :  Date.now()
  }

  var nota = req.body.nota || '';
  if(nota != '')
    rating.nota = nota;

  return rating;
}

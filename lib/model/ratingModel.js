
exports.newRating = function(req){
  var rating = {
    id : req.params.id,
    username : req._passport.session.user
  }

  var nota = req.body.nota || '';
  if(nota != '')
    rating.nota = nota;

  return rating;
}

exports.newComment = function(req){
  var comment = {
    updated_at :  Date.now(),
    id : uuid.v1(),
    created_at : Date.now(),
    score : 0,
    user : req._passport.session.user
  }

  var idParent = req.body.idParent || '';
  if(idParent != '')
    comment.idParent = idParent;

  var content = req.body.content || '';
  if(content != '')
    comment.content = content;


  return comment;
}

exports.updateComment = function(req, comment_old){
  var comment = {
    updated_at :  { value: Date.now()}
  }
  
  var content = req.body.content || '';
  if(content != '')
    comment.content = {value: content};

  return comment;
}
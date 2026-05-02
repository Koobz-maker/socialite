import Common "common";

module {
  public type UserId = Common.UserId;
  public type PostId = Common.PostId;
  public type CommentId = Common.CommentId;

  // Comment stored in state
  public type Comment = {
    id : CommentId;
    postId : PostId;
    authorPrincipal : UserId;
    text : Text;
    createdAt : Common.Timestamp;
  };
};

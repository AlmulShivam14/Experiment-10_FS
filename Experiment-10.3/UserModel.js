// User model
const UserSchema = new mongoose.Schema({
  username: String, email: String, password: String, avatar: String
});
const User = mongoose.model('User', UserSchema);

// Post model
const PostSchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ body: String, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, date: Date }]
});
const Post = mongoose.model('Post', PostSchema);

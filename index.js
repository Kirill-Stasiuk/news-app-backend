import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

// TODO: need to create config with keys
mongoose
  .connect(
    'mongodb+srv://Kirill:nagibator2003@cluster0.dnjposm.mongodb.net/blog?retryWrites=true&w=majority',
      {useUnifiedTopology: true, useNewUrlParser: true})
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(express.static('static'));
app.use(cors());
app.use(fileUpload({}))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/user/:userId', PostController.getByUser);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostController.update);

app.post('/posts/:id/comments', checkAuth, commentCreateValidation, PostController.addComment);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server Ok');
});

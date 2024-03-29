import CommentModel from "../models/Comment.js";
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
import fileLoader from "../utils/fileLoader.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Post not returned',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};

export const getByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await PostModel.find({ user: userId }).populate('user').exec();
    res.json(posts);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: 'Post not deleted',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Post not found',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Posts not found',
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const user = await UserModel.findById(req.userId);
    const comment = new CommentModel({
      text: req.body.text,
      user: req.userId,
      fullName: user.fullName
    })

    await comment.save();
    await PostModel.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $push: {comments: comment}
        }).populate('user').populate({ path: 'comments', populate: { path: 'user' } });

    res.json({
      success: 'Comment added',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Creating comment fail',
    });
  }
}

export const create = async (req, res) => {
  try {
    const fileName = fileLoader.saveFile(req.files.imageUrl);
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: fileName,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Creating post fail',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const fileName = fileLoader.saveFile(req.files.imageUrl);

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: fileName,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Updating post fail',
    });
  }
};

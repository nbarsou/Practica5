const Sequelize = require('sequelize');
const createError = require('http-errors');
const { models } = require('../models');

// GET /quizzes
exports.index = async (req, res, next) => {
  try {
    const findOptions = {
      include: [{ model: models.Attachment, as: 'attachment' }],
    };
    const posts = await models.Posts.findAll(findOptions);
    res.render('blog/index.ejs', { posts });
  } catch (error) {
    next(error);
  }
};

// GET /posts/:postId AUTOLOAD
exports.load = async (req, res, next, postId) => {
  try {
    const post = await models.Posts.findByPk(postId, {
      include: [{ model: models.Attachment, as: 'attachment' }],
    });
    if (post) {
      req.load = { ...req.load, post };
      next();
    } else {
      throw createError(404, 'There is no post with id=' + postId);
    }
  } catch (error) {
    next(error);
  }
};

exports.show = (req, res, next) => {
  const { post } = req.load;
  res.render('blog/show.ejs', { post });
};

// GET /posts/new
exports.new = (req, res, next) => {
  const post = {
    title: '',
    body: '',
  };
  res.render('blog/new.ejs', { post });
};

// POST /posts
exports.create = async (req, res, next) => {
  const { title, body } = req.body;
  let post;
  try {
    post = models.Posts.build({
      title,
      body,
    });
    // Saves only the fields question and answer into the DDBB
    post = await post.save({ fields: ['title', 'body'] });
    try {
      if (!req.file) {
        console.log('Info: Post without attachment.');
        return;
      }
      // Create the post attachment
      const attachment = await models.Attachment.create({
        mime: req.file.mimetype,
        image: req.file.buffer,
        url: null,
      });
      await post.setAttachment(attachment);
      console.log('Success: Attachment saved successfully.');
    } catch (error) {
      console.log('herehrheError:' + error.message);
    } finally {
      res.redirect('/posts/' + post.id);
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      console.log('There are errors in the form:');
      error.errors.forEach(({ message }) => console.log(message));
      res.render('blog/new.ejs', { post });
    } else {
      next(error);
    }
  }
};

// GET /posts/:postId/edit
exports.edit = (req, res, next) => {
  const postId = Number(req.params.postId);

  models.Posts.findByPk(postId)
    .then((post) => {
      if (post) {
        res.render('blog/edit.ejs', { post });
      } else {
        throw new Error('There is no post with id=' + postId);
      }
    })
    .catch((error) => next(error));
};

// PUT /posts/:postId
exports.update = async (req, res, next) => {
  const { post } = req.load;
  post.title = req.body.title;
  post.body = req.body.body;
  try {
    await post.save({ fields: ['title', 'body'] });
    try {
      if (!req.file) {
        console.log('Info: Post attachment not changed.');
        return;
      }
      // Delete old attachment.
      await post.attachment?.destroy();
      // Create the new attachment:
      const attachment = await models.Attachment.create({
        mime: req.file.mimetype,
        image: req.file.buffer,
        url: null,
      });
      await post.setAttachment(attachment);
      console.log('Success: Attachment saved successfully.');
    } catch (error) {
      console.log('Error:' + error.message);
    } finally {
      res.redirect('/posts/' + post.id);
    }
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      console.log('There are errors in the form:');
      error.errors.forEach(({ message }) => console.log(message));
      res.render('posts/edit.ejs', { post });
    } else {
      next(error);
    }
  }
};

// DELETE /quizzes/:quizId
exports.destroy = async (req, res, next) => {
  const attachment = req.load.post.attachment;

  try {
    await req.load.post.destroy();
    await attachment?.destroy();
    res.redirect('/posts');
  } catch (error) {
    next(error);
  }
};
// GET /posts/:postId(\\d+)/attachment
exports.attachment = (req, res, next) => {
  const { post } = req.load;
  const { attachment } = post;
  if (!attachment) {
    res.redirect('/images/none.png');
  } else if (attachment.image) {
    res.type(attachment.mime);
    res.send(attachment.image);
  } else if (attachment.url) {
    res.redirect(attachment.url);
  } else {
    res.redirect('/images/none.png');
  }
};

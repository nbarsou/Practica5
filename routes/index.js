var express = require('express');
var router = express.Router();

// For attachments
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const blogController = require('../controllers/blog.js');

/* GET /
 * Muestra la página home de bienvenida.
 */
router.get('/', function (req, res, next) {
  res.render('index');
});

/* GET /author page
 * Muestra la página de créditos con el nombre y la fotografía del autor.
 */
router.get('/author', function (req, res, next) {
  res.render('author');
});

/* GET /posts
 * Muestra un listado con todos los posts existentes en la BBDD.
 */
router.get('/posts', blogController.index);

/* GET /posts/:postId(\\d+)
 * Muestra el post de la BBDD cuyo id es igual al valor pasado en el parámetro de ruta :postId.
 */
router.param('postId', blogController.load); // Autoload for routes using :postId
router.get('/posts/:postId(\\d+)', blogController.show);

/* GET /posts/new
 * Muestra una página con un formulario para crear un nuevo post.
 */
router.get('/posts/new', blogController.new);

/* POST /posts
 * Invocado por el formulario anterior para crear el post con los datos introducidos.
 */
router.post('/posts', upload.single('image'), blogController.create);

/* GET /posts/:postId(\\d+)/edit
 *  Muestra una página con un formulario para editar el post cuyo id es igual al valor pasado en el parámetro de ruta :postId.
 */
router.get('/posts/:postId(\\d+)/edit', blogController.edit);

/* PUT /posts/:postId(\\d+)
 * Invocado por el formulario anterior para actualizar el post con id igual a :postId.
 */
router.put(
  '/posts/:postId(\\d+)',
  upload.single('image'),
  blogController.update
);

/* DELETE /posts/:postId(\\d+)
 * Borrar de la BBDD el post cuyo id es igual a :postId.
 */
router.delete('/posts/:postId(\\d+)', blogController.destroy);

/* GET /post/:postId(\\d+)/attachment
 * Devuelve la imagen adjunta del post cuyo id es igual a :postId, y si no existe, devolver una imagen por defecto (/images/none.png).
 */
router.get('/posts/:postId(\\d+)/attachment', blogController.attachment);

module.exports = router;

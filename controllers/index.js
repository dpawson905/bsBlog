module.exports = {
  getIndex(req, res, next) {
    res.render('index', {
      url: 'home'
    });
  }
}
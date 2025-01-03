import Favorite from '../models/Favorite.js';

async function getFavorites(req, res){
  try {
    const { category, limit = 5, offset = 0 } = req.query;

    const filter = { user: req.user.id };
    if (category) filter.category = category;

    const favorites = await Favorite.find(filter)
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('itemId', 'name');

    res.status(200).json({
      status: 200,
      data: favorites,
      message: 'Favorites retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function addFavorite(req, res){
  try {
    const { category, itemId } = req.body;

    if (!category || !itemId) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Missing required fields',
        error: null,
      });
    }

    const favorite = new Favorite({ user: req.user.id, category, itemId });
    await favorite.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Favorite added successfully',
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function removeFavorite(req, res){
  try {
    const { id } = req.params;

    const favorite = await Favorite.findByIdAndDelete(id);

    if (!favorite) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Favorite not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: 'Favorite removed successfully',
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

export {getFavorites, addFavorite, removeFavorite}
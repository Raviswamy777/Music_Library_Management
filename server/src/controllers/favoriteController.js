import Favorite from '../models/Favorite.js';
import Artist from '../models/Artist.js';
import Track from '../models/Track.js';
import Album from '../models/Album.js';
async function getFavorites(req, res){
  try {
    const { category, limit, offset  } = req.query;

    const filter = { user: req.user.id };
    if (category) filter.category = category;

    const favorites = await Favorite.find(filter)
      .skip(Number(offset))
      .limit(Number(limit))
      .lean(); // Use `lean()` to get plain JavaScript objects for easier manipulation

    const populatedFavorites = await Promise.all(
      favorites.map(async (favorite) => {
        let populatedItem = null;

        if (favorite.category === 'artist') {
          populatedItem = await Artist.findById(favorite.itemId).select('name');
        } else if (favorite.category === 'album') {
          populatedItem = await Album.findById(favorite.itemId).select('name');
        } else if (favorite.category === 'track') {
          populatedItem = await Track.findById(favorite.itemId).select('name');
        }

        return {
          ...favorite,
          name: populatedItem.name, // Add populated data as a new field
        };
      })
    );

    res.status(200).json({
      status: 200,
      data: populatedFavorites,
      message: 'Favorites retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function addFavorite(req, res){
  try {
    const { category, item_id } = req.body;

    if (!category || !item_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Missing required fields',
        error: null,
      });
    }

    const favorite = new Favorite({ user: req.user.id, category, itemId:item_id });
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
    const { favorite_id } = req.params;

    const favorite = await Favorite.findByIdAndDelete(favorite_id);

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
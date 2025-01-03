import Album from '../models/Album.js';
import Artist from '../models/Artist.js';

async function getAlbums(req, res){
  try {
    const { limit = 5, offset = 0, artistId, hidden } = req.query;
    const filter = {};
    if (artistId) filter.artist = artistId;
    if (hidden !== undefined) filter.hidden = hidden === 'true';

    const albums = await Album.find(filter)
      .populate('artist', 'name')
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      status: 200,
      data: albums,
      message: 'Albums retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function getAlbumById(req, res){
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate('artist', 'name');

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: album,
      message: 'Album retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function createAlbum(req, res){
  try {
    const { name, year, artistId, hidden } = req.body;

    if (!name || !year || !artistId) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Missing required fields',
        error: null,
      });
    }

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found',
        error: null,
      });
    }

    const album = new Album({ name, year, artist: artistId, hidden });
    await album.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Album created successfully',
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function updateAlbum(req, res){
  try {
    const { id } = req.params;
    const { name, year, artistId, hidden } = req.body;

    const album = await Album.findByIdAndUpdate(
      id,
      { name, year, artist: artistId, hidden },
      { new: true, runValidators: true }
    );

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found',
        error: null,
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function deleteAlbum(req, res){
  try {
    const { id } = req.params;

    const album = await Album.findByIdAndDelete(id);

    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Album not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: `Album: ${album.name} deleted successfully`,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};


export {getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum}
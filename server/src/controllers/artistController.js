import Artist from '../models/Artist.js';

async function getArtists(req, res){
  try {
    const { limit = 5, offset = 0, grammy, hidden } = req.query;
    const filter = {};
    if (grammy !== undefined) filter.grammy = grammy === 'true';
    if (hidden !== undefined) filter.hidden = hidden === 'true';

    const artists = await Artist.find(filter).skip(Number(offset)).limit(Number(limit));

    res.status(200).json({
      status: 200,
      data: artists,
      message: 'Artists retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function getArtistById(req, res){
  try {
    const { id } = req.params;
    const artist = await Artist.findById(id);

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: artist,
      message: 'Artist retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function createArtist(req, res){
  try {
    const { name, grammy, hidden } = req.body;
    
    if (!name || !grammy) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad Request',
        error: null,
      });
    }

    const artist = new Artist({ name, grammy, hidden });
    await artist.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Artist created successfully',
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function updateArtist(req, res){
  try {
    const { artist_id } = req.params;
    const { name, grammy, hidden } = req.body;
    if (!artist_id ) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Bad request',
        error: null,
      });
    }
    const artist = await Artist.findByIdAndUpdate(
      artist_id,
      { name, grammy, hidden },
      { new: true, runValidators: true }
    );

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found',
        error: null,
      });
    }

    res.status(204).json({ status: 204, data: null, message: 'Artist updated successfully', error: null});
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal server error', error: error.message });
  }
};

async function deleteArtist(req, res){
  try {
    const { id } = req.params;

    const artist = await Artist.findByIdAndDelete(id);

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: `Artist: ${artist.name} deleted successfully`,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};


export {getArtists, getArtistById, createArtist, updateArtist, deleteArtist}
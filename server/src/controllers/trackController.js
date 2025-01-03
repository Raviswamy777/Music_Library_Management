import Track from '../models/Track.js';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';

async function getTracks(req, res){
  try {
    const { limit = 5, offset = 0, artistId, albumId, hidden } = req.query;
    const filter = {};
    if (artistId) filter.artist = artistId;
    if (albumId) filter.album = albumId;
    if (hidden !== undefined) filter.hidden = hidden === 'true';

    const tracks = await Track.find(filter)
      .populate('artist', 'name')
      .populate('album', 'name')
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      status: 200,
      data: tracks,
      message: 'Tracks retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function getTrackById(req, res){
  try {
    const { id } = req.params;
    const track = await Track.findById(id).populate('artist', 'name').populate('album', 'name');

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: track,
      message: 'Track retrieved successfully',
      error: null,
    });
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function createTrack(req, res){
  try {
    const { name, duration, albumId, artistId, hidden } = req.body;

    if (!name || !duration || !albumId || !artistId) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Missing required fields',
        error: null,
      });
    }

    const album = await Album.findById(albumId);
    const artist = await Artist.findById(artistId);

    if (!album || !artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist or Album not found',
        error: null,
      });
    }

    const track = new Track({ name, duration, album: albumId, artist: artistId, hidden });
    await track.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: 'Track created successfully',
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};

async function updateTrack(req, res){
  try {
    const { id } = req.params;
    const { name, duration, albumId, artistId, hidden } = req.body;

    const track = await Track.findByIdAndUpdate(
      id,
      { name, duration, album: albumId, artist: artistId, hidden },
      { new: true, runValidators: true }
    );

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found',
        error: null,
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ status: 400, data: null, message: 'Bad Request', error: error.message });
  }
};

async function deleteTrack(req, res){
  try {
    const { id } = req.params;

    const track = await Track.findByIdAndDelete(id);

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Track not found',
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: `Track: ${track.name} deleted successfully`,
      error: null,
    });
  } catch (error) {
    res.status(500).json({ status: 500, data: null, message: 'Internal Server Error', error: error.message });
  }
};


export {getTracks, getTrackById, createTrack, updateTrack, deleteTrack}
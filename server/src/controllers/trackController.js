import Track from '../models/Track.js';
import Album from '../models/Album.js';
import Artist from '../models/Artist.js';

async function getTracks(req, res){
  try {
    const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
    const filter = {};
    if (artist_id) filter.artist = artist_id;
    if (album_id) filter.album = album_id;
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
    const { track_id } = req.params;
    const track = await Track.findById(track_id).populate('artist', 'name').populate('album', 'name');

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
    const { name, duration, album_id, artist_id, hidden } = req.body;

    if (!name || !duration || !album_id || !artist_id) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: 'Missing required fields',
        error: null,
      });
    }

    const album = await Album.findById(album_id);
    const artist = await Artist.findById(artist_id);

    if (!album || !artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Artist or Album not found',
        error: null,
      });
    }

    const track = new Track({ name, duration, album: album_id, artist: artist_id, hidden });
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
    const { track_id } = req.params;
    const { name, duration, album_id, artist_id, hidden } = req.body;

    const track = await Track.findByIdAndUpdate(
      track_id,
      { name, duration, album: album_id, artist: artist_id, hidden },
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
    const { track_id } = req.params;

    const track = await Track.findByIdAndDelete(track_id);

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
const express = require('express');
const router = express.Router();
const Speaker = require('../models/Speaker');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all speakers (optionally filter by page)
router.get('/', authenticate, async (req, res) => {
  try {
    const { pageId } = req.query;
    const query = pageId ? { pageId } : {};
    
    const speakers = await Speaker.find(query)
      .populate('pageId', 'name')
      .populate('availability.lockedBy', 'username')
      .sort({ name: 1 });
    
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching speakers', error: error.message });
  }
});

// Get single speaker
router.get('/:id', authenticate, async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id)
      .populate('pageId', 'name')
      .populate('availability.lockedBy', 'username');
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching speaker', error: error.message });
  }
});

// Create speaker (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, area, phoneNumber, pageId } = req.body;

    const speaker = new Speaker({
      name,
      area,
      phoneNumber,
      pageId
    });

    await speaker.save();
    await speaker.populate('pageId', 'name');
    
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error creating speaker', error: error.message });
  }
});

// Update speaker details (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, area, phoneNumber, pageId } = req.body;
    
    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      { name, area, phoneNumber, pageId },
      { new: true, runValidators: true }
    ).populate('pageId', 'name').populate('availability.lockedBy', 'username');

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error updating speaker', error: error.message });
  }
});

// Update speaker availability (all users)
router.patch('/:id/availability', authenticate, async (req, res) => {
  try {
    const { programDate, programTime, makeAvailable } = req.body;
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    // If making speaker available again
    if (makeAvailable) {
      speaker.availability = {
        isAvailable: true,
        programDate: null,
        programTime: null,
        lockedBy: null,
        lockedAt: null
      };
    } else {
      // Locking speaker for a program
      if (!programDate || !programTime) {
        return res.status(400).json({ message: 'Program date and time are required' });
      }

      // Check if speaker is already locked
      if (!speaker.availability.isAvailable) {
        return res.status(400).json({ 
          message: 'Speaker is already scheduled for a program',
          lockedBy: speaker.availability.lockedBy
        });
      }

      speaker.availability = {
        isAvailable: false,
        programDate: new Date(programDate),
        programTime,
        lockedBy: req.userId,
        lockedAt: new Date()
      };
    }

    await speaker.save();
    await speaker.populate('pageId', 'name');
    await speaker.populate('availability.lockedBy', 'username');

    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
});

// Delete speaker (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);

    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    res.json({ message: 'Speaker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting speaker', error: error.message });
  }
});

module.exports = router;
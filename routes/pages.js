const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const Speaker = require('../models/Speaker');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all pages
router.get('/', authenticate, async (req, res) => {
  try {
    const pages = await Page.find().sort({ order: 1, name: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages', error: error.message });
  }
});

// Create page (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, order } = req.body;

    const page = new Page({
      name,
      order: order || 0
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Page name already exists' });
    }
    res.status(500).json({ message: 'Error creating page', error: error.message });
  }
});

// Update page (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, order } = req.body;
    
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { name, order },
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Error updating page', error: error.message });
  }
});

// Delete page (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    // Check if page has speakers
    const speakerCount = await Speaker.countDocuments({ pageId: req.params.id });
    
    if (speakerCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete page. It has ${speakerCount} speaker(s). Please delete or move the speakers first.` 
      });
    }

    const page = await Page.findByIdAndDelete(req.params.id);

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting page', error: error.message });
  }
});

module.exports = router;
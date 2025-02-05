const express = require('express');
const cors = require('cors');
const { runScraper } = require('./scraper'); // Import your scraper function

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows your Next.js frontend to make API requests

// Define an API route to trigger the scraper
app.get('/scrape', async (req, res) => {
    try {
        const data = await runScraper(); // Calls your web scraper function
        res.json({ success: true, data }); // Sends scraped data as JSON response
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ success: false, message: 'Failed to scrape data' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

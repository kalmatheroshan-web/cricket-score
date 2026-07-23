const express = require('express');
const matchRouter = express.Router();

const {
    createMatch,
    launchMatch,
    updateLiveScore,
    getMatches,
    completeMatch,
    getScorerMatch
} = require('../controller/Match');


matchRouter.post('/', createMatch);
matchRouter.post('/launch', launchMatch);
matchRouter.put('/score', updateLiveScore);
matchRouter.get('/', getMatches);
matchRouter.post('/scorer-match', getScorerMatch);
matchRouter.post('/:id/complete', completeMatch);


module.exports = matchRouter;
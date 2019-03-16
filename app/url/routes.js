const router = require('express').Router();

const url = require('./url');

router.get('/:hash', async (req, res, next) => {

  const source = await url.getUrl(req.params.hash);

  // TODO: Respond accordingly when the hash wasn't found (404 maybe?)
    if(!source){
        res.status(404).json({
            message: 'Url not found, please verify it again'
        });
    } 
    
    // TODO: Hide fields that shouldn't be public
    
    delete source._doc.protocol; // These fields where stored to metrics purpose
    delete source._doc.domain;
    delete source._doc.path;
    delete source._doc.hash;

  // Behave based on the requested format using the 'Accept' header.
  // If header is not provided or is */* redirect instead.
  const accepts = req.get('Accept');

  switch (accepts) {
    case 'text/plain':
      res.end(source.url);
      break;
    case 'application/json':
      res.json(source);
      break;
    default:
      res.redirect(source.url);
      break;
  }

});

router.get('/', url.getUrls);

router.post('/', async (req, res, next) => {

  // TODO: Validate 'req.body.url' presence
  if(!req.body.url){
      res.status(400).json({
          message: 'Plase send a valid url'
      });
  } 

  try {
    
    let shortUrl = await url.shorten(
        req.body.url, 
        url.generateHash(req.body.url)
    );

    res.json({ message: 'Url created succesfully', shortUrl: shortUrl});

  } catch (e) {
    
    // TODO: Personalized Error Messages
    res.statusMessage = e.message;
    res.sendStatus(500);
    
  }


});


router.delete('/:hash/:removeToken', async (req, res, next) => {
    
    // TODO: Remove shortened URL if the remove token and the hash match
    try{
        
        let result = await url.removeUrl(req.params.hash, req.params.removeToken);

        if(result.n === 1){

            res.status(200).json({
                message: 'Url deleted succesfully'
            });

        } else {

            res.status(400).json({
                message: 'Url not existing in this place'
            });
            
        }

    } catch(e) {
        
        res.statusMessage = e.message;
        res.sendStatus(500);

    }

});

module.exports = router;

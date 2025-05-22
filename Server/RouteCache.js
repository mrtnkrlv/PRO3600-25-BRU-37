import NodeCache from 'node-cache'
const cache = new NodeCache()

// duration est la fonction utilisée pour implémenter le cache

const duration = (duration) => (req, res, next) => { // duration est la durée de stockage de la clé
    if (req.method != 'GET') {
        console.error('Cannot cache non-GET methods')
        return next()
    }
    const key = req.originalUrl
    const CachedResponse = cache.get(key)
    if (CachedResponse) {
        console.log(`Cache hit for ${key}`)
        return res.send(CachedResponse)
    }
    console.log(`Cache miss for ${key}`)
    const originalSend = res.send;
    res.send = (body) => {
      originalSend.call(res, body); 
      cache.set(key, body, duration);}
    next()

}

export default duration

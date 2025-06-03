/**
 * @fileoverview
 * Middleware de mise en cache HTTP simple, basé sur **node-cache**.
 *
 * - Seuls les appels **GET** sont mis en cache (les autres verbes sont ignorés).
 * - La clé de cache correspond à `req.originalUrl`.
 * - Le corps de la réponse est conservé `duration` secondes.
 *
 * @module cacheMiddleware
 */

import NodeCache from 'node-cache';

/**
 * Instance de cache mémoire partagée par tout le processus Node.
 * Le TTL par entrée est défini dynamiquement par le middleware.
 *
 * @type {NodeCache}
 */
const cache = new NodeCache();

/**
 * Fabrique de middleware Express permettant de mettre en cache
 * la réponse d’une route **GET** pendant un nombre de secondes donné.
 *
 * @function duration
 * @param {number} duration - Temps de conservation de l’entrée (en secondes).
 * @returns {express.RequestHandler}- Une fonction middleware compatible Express.
 * @example <caption>Cache de 60 s pour /users</caption>
 * import express from 'express';
 * import duration from './cache-middleware.js';
 *
 * const app = express();
 * app.get('/users', duration(60), listUsers);
 *
 * @throws {TypeError} Si `duration` n’est pas un nombre positif.
 */
const duration = (duration) => {
  if (typeof duration !== 'number' || duration <= 0) {
    throw new TypeError('duration doit être un nombre positif');
  }

  /** @type {express.RequestHandler} */
  return (req, res, next) => {
    // Ne jamais mettre en cache les méthodes autres que GET
    if (req.method !== 'GET') {
      console.error('Seules les méthodes GET sont mises en cache');
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    //On regarde dans le cache
    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      return res.send(cachedResponse);
    }

    console.log(`Cache miss for ${key}`);

    //On intercepte res.send
    const originalSend = res.send.bind(res);

    /**
     * Remplace temporairement res.send pour
     * stocker la réponse dans le cache avant de l’envoyer.
     *
     * @param {*} body - Corps à renvoyer au client.
     * @returns {void}
     */
    res.send = (body) => {
      originalSend(body);
      cache.set(key, body, duration);
    };

    next();
  };
};

export default duration;

class LRUCache {
  /**
   * @param {number} capacity  capacité max du cache LRU
   */
  constructor(capacity = 100) {
    if (capacity <= 0) throw new Error('Capacity must be > 0');
    this.capacity = capacity;
    this.map      = new Map();     //on utilise une MAP car elle conserve l'ordre
  }

  /**
   * GUne valeur par clé
   * On déplace la clé à la position la plus récente
   *
   * @param {*} key
   * @returns {*} value | undefined
   */
  get(key) {
    if (!this.map.has(key)) return undefined;

    // on ré-insère la clé pour qu'elle soit la plus récente
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);

    return value;
  }

  /**
   * Ajouter une valeur dans le cache
   * Si laclé existe déjà on update et on met en première position
   * Si capacité max atteinte on retire la clé la plus ancienne pour ajouter la nouvelle
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    // Si clé déjà existante on la delete pour refresh sa position
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // On supprime la clé la plus vieille
      const lruKey = this.map.keys().next().value;   //Indique la clé la plus vieille
      this.map.delete(lruKey);
    }

    this.map.set(key, value);
  }

 //Taille Cache
  get size() {
    return this.map.size;
  }

//Vider cache
  clear() {
    this.map.clear();
  }
}
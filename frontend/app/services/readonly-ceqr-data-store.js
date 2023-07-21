import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

import { fetchAndSaveModalSplit } from 'labs-ceqr/utils/modalSplit';

/**
 * A datastore for readonly CEQR data that does not fit nicely into the normal EmberData model.
 * Specifically: modal-split data is composed of multiple records from the backend rails
 * service, but conceptually is easier to treat as a single object with geoid as identifier.
 *
 * At present, requires a custom fetchAndSave[OBJECT] function for any data-types that will be stored.
 * fetchAndSave[OBJECT] should return a promise that resolves to the requested object. It should take
 * a reference to this store as an argument, and add the requested object to the store before returning.
 */
export default class ReadOnlyCeqrDataStoreService extends Service {
  /**
   * Session service, required to make authenticated calls to the backend rails service
   */
  @service session;

  constructor(...args) {
    super(...args);
    set(this, 'storeHash', {});
  }

  /**
   * Adds an object to the store
   * @param type The object type
   * @param id The object's identifier
   * @param value The object
   */
  add(type, id, value) {
    const store = this.storeHash;
    if (!store[type]) {
      store[type] = {};
    }

    store[type][id] = value;
  }

  /**
   * Returns a promise that resolves to an array of objects
   * @param type The object type
   * @param ids The objects' identifiers
   * @returns Promise
   */
  findByIds(type, ids) {
    return Promise.all(ids.map((id) => this.find(type, id)));
  }

  /**
   * Returns a promise that resolves to the record, either from the local store
   * or from the backend via _fetch().
   * @param type The object's type
   * @param id The object's identifier
   * @returns Promise
   */
  find(type, id) {
    const record = this.getRecord(type, id);
    if (record) {
      return new Promise(function (resolve) {
        resolve(record);
      });
    }
    return this._fetch(type, id);
  }

  /**
   * Retrieves a record from the local store, or false if it does not exist yet.
   * @param type The object type
   * @param id The object's identifier
   * @returns The object or false
   */
  getRecord(type, id) {
    if (this.storeHash[type]) return this.storeHash[type][id];
  }

  /**
   * Retrieves the resource from the rails backend, if fetch has been implemented
   * for the given object type.
   * @param type The object type
   * @param id The obejct's identifier
   * @returns Promise that resolves to the formatted object, or rejects with error message if not implemented
   */
  _fetch(type, id) {
    const session = this.session;
    if (type === 'ACS-modal-split') {
      return fetchAndSaveModalSplit('ACS', id, session, this);
    }
    if (type === 'CTPP-modal-split') {
      return fetchAndSaveModalSplit('CTPP', id, session, this);
    }
    return new Promise(function (resolve, reject) {
      reject(`Fetch for ${type} not implemented`);
    });
  }
}

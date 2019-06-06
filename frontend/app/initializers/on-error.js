import { on } from 'rsvp';
import Ember from 'ember';
import ENV from 'labs-ceqr/config/environment';

const { shouldThrowOnError } = ENV;

export function initialize() {
  if (shouldThrowOnError) {
    Ember.onerror = function(err) {
      throw err;
    };
    on('error', function(err) {
      throw err;
    });
  }
}

export default {
  initialize
};

import { on } from 'rsvp';
import Ember from 'ember';
import ENV from 'labs-ceqr/config/environment';

const { shouldThrowOnError } = ENV;

export function initialize() {
  if (shouldThrowOnError) {
    Ember.onerror = function(err) {
      throw new Error(err);
    };
    on('error', function(err) {
      throw new Error(err);
    });
  }
}

export default {
  initialize
};

'use strict';

class IOWS2Error extends Error {}
class IOWS2ParseError extends IOWS2Error{}
class IOWS2ResponseError extends IOWS2Error{}

module.exports = {
  IOWS2Error,
  IOWS2ParseError,
  IOWS2ResponseError,
}

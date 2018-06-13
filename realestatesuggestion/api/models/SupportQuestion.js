/**
 * SupportQuestion.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    isRead: {
      type: 'boolean'
    },

    questionTitle: {
      type: 'string'

    },

    questionBody: {
      type: 'string'

    },

    readDate: {
      type: 'string'

    },
      responseDate: {
      type: 'string'

    },
    responseDetail: {
      type: 'string'

    },
    supportUser: {
      model: 'User'

    },
    user: {
      model: 'User'

    }

  }
}



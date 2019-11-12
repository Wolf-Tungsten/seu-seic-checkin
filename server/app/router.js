'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/checkIn', controller.checkIn.checkIn);
  router.post('/login', controller.user.login);
  router.get('/meeting', controller.meeting.status);
  router.post('/meeting/start', controller.meeting.start);
  router.post('/meeting/stop', controller.meeting.stop);
  router.get('/data', controller.data.get);
  router.delete('/data', controller.data.delete);
};

module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /attachments/:uuid
   * @apiName AttachmentItemPatch
   * @apiGroup Attachment
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      await controllers.AttachmentCtrl.updateAttachment({
        attachmentUuid: req.params.uuid,
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const attachment = await models.Attachment.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': attachment.get('created_at'),
            'name': attachment.get('name'),
          },
          'id': attachment.get('uuid'),
          'type': 'attachments',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};

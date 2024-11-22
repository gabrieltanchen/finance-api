export default (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /attachments
   * @apiName AttachmentPost
   * @apiGroup Attachment
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.expense
   * @apiParam {object} data.relationships.expense.data
   * @apiParam {string} data.relationships.expense.data.id
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/amount-cents",
   *        },
   *        "detail": "Amount is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const attachmentUuid = await controllers.AttachmentCtrl.createAttachment({
        auditApiCallUuid: req.auditApiCallUuid,
        expenseUuid: req.body.data.relationships.expense.data.id,
        name: req.body.data.attributes.name,
      });

      const attachment = await models.Attachment.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: attachmentUuid,
        },
      });

      return res.status(201).json({
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

import * as reportsService from '../services/reports.service';

export async function getAll(req, res, next) {
  try {
    const reports = await reportsService.getAll();
    res.json(reports);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { target_listing_id, target_user_id, reason } = req.body;
    const report = await reportsService.create({
      reporter_id: req.auth.id,
      target_listing_id,
      target_user_id,
      reason,
    });
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const report = await reportsService.updateStatus(req.params.id, req.body.status);
    res.json(report);
  } catch (err) {
    next(err);
  }
}

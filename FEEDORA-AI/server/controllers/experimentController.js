import Experiment from '../models/Experiment.js';

export const createExperiment = async (req, res, next) => {
  try {
    const { businessId, demandSignalTitle, hypothesis, projectedCost, projectedRevenue, durationDays = 14 } = req.body;
    if (!businessId || !demandSignalTitle) {
      return res.status(400).json({ success: false, error: 'businessId and demandSignalTitle are required' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (parseInt(durationDays, 10) || 14));

    const experiment = await Experiment.create({
      businessId,
      demandSignalTitle,
      hypothesis: hypothesis || `Introducing ${demandSignalTitle} will capture unmet demand and increase average customer ticket size.`,
      projectedCost: parseFloat(projectedCost) || 0,
      projectedRevenue: parseFloat(projectedRevenue) || 0,
      startDate,
      endDate,
      status: 'active',
      decision: 'pending'
    });

    res.status(201).json({ success: true, data: experiment });
  } catch (error) {
    next(error);
  }
};

export const getExperiments = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const experiments = await Experiment.find({ businessId }).sort({ createdAt: -1 }).exec();
    res.json({ success: true, data: experiments });
  } catch (error) {
    next(error);
  }
};

export const updateExperiment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, actualRevenue, customerFeedbackCount, outcomeNotes, decision } = req.body;

    const updated = await Experiment.findByIdAndUpdate(id, {
      status,
      actualRevenue: actualRevenue !== undefined ? parseFloat(actualRevenue) : undefined,
      customerFeedbackCount: customerFeedbackCount !== undefined ? parseInt(customerFeedbackCount, 10) : undefined,
      outcomeNotes,
      decision
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

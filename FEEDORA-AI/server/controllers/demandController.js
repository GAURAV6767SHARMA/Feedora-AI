import { getBusinessDemandRadar } from '../services/demandService.js';

export const getDemandRadar = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    if (!businessId) {
      return res.status(400).json({ success: false, error: 'businessId is required' });
    }

    const data = await getBusinessDemandRadar(businessId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

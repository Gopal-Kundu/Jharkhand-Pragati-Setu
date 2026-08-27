import IndustryPartner from '../models/IndustryPartner.js';
import { MASTER_INDUSTRY_CATALOG } from '../data/masterCatalog.js';

/**
 * @desc    Get all Industry, CSR Foundations, MSMEs, and Startups
 * @route   GET /api/industry
 * @access  Public
 */
export const getIndustryPartners = async (req, res) => {
  try {
    const { domain, type } = req.query;
    const filter = {};

    if (domain && domain !== 'all') {
      filter.focusDomains = new RegExp(domain, 'i');
    }
    if (type && type !== 'all') {
      filter.type = type;
    }

    let partners = await IndustryPartner.find(filter).sort({ csrAnnualBudgetInr: -1, name: 1 });

    if (!partners || partners.length === 0) {
      partners = MASTER_INDUSTRY_CATALOG;
    }

    return res.status(200).json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (error) {
    console.error('[Get Industry Partners Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching industry partners'
    });
  }
};

/**
 * @desc    Get single Industry partner details
 * @route   GET /api/industry/:id
 * @access  Public
 */
export const getIndustryPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await IndustryPartner.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { partnerId: id }]
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: `Industry partner '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      partner
    });
  } catch (error) {
    console.error('[Get Industry Partner By ID Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching industry partner profile'
    });
  }
};

export default {
  getIndustryPartners,
  getIndustryPartnerById
};
